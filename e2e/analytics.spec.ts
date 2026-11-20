import { test, expect, type Page } from "@playwright/test";

const backend = "http://127.0.0.1:4319";
const choiceKey = "jobbod_analytics_v1";
const fakeId = "G-TEST123456";

async function configured(page: Page) {
  await page.route("**/api/measurement", route => route.fulfill({ json: {
    success: true, status: 200, code: "SUCCESS", message: "OK", data: { measurementId: fakeId },
  } }));
  // No event or test identifier is sent to Google during this suite.
  await page.route("https://www.googletagmanager.com/**", route => route.fulfill({ contentType: "application/javascript", body: "/* isolated Google tag */" }));
}

async function events(page: Page, name?: string) {
  return page.evaluate(eventName => (window.dataLayer ?? [])
    .map(command => Array.from(command as ArrayLike<unknown>))
    .filter(command => command[0] === "event" && (!eventName || command[1] === eventName))
    .map(command => ({ name: command[1] as string, parameters: command[2] as Record<string, unknown> })), name);
}

async function register(page: Page) {
  await page.getByLabel("Họ và tên", { exact: true }).fill("Nguyễn An");
  await page.getByLabel("Email", { exact: true }).fill("student@example.com");
  await page.getByLabel("Mật khẩu", { exact: true }).fill("password123");
  await page.getByRole("button", { name: "Tạo tài khoản", exact: true }).click();
}

test.beforeEach(async ({ page, request }) => {
  await request.post(`${backend}/__reset`);
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("missing runtime configuration leaves analytics off and exposes no other environment values", async ({ page, request }) => {
  const response = await request.get("/api/measurement");
  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toContain("no-store");
  expect((await response.json()).data).toEqual({ measurementId: null });
  const requests: string[] = [];
  page.on("request", request => { if (/googletagmanager|google-analytics/.test(request.url())) requests.push(request.url()); });
  await page.goto("/vi/login?email=student%40example.com");
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue("student@example.com");
  await expect(page.locator(".analytics-banner, .analytics-settings")).toHaveCount(0);
  expect(await page.evaluate(() => window.dataLayer)).toBeUndefined();
  expect(requests).toEqual([]);
});

test("declining never loads the tag; accepting then withdrawing stops it and removes analytics cookies", async ({ page, context }) => {
  await configured(page);
  const scripts: string[] = [];
  page.on("request", request => { if (request.url().includes("googletagmanager.com/gtag")) scripts.push(request.url()); });
  await page.goto("/vi");
  await expect(page.getByRole("complementary", { name: "Giúp cải thiện Jobbod" })).toBeVisible();
  expect(scripts).toEqual([]);
  await page.getByRole("button", { name: "Chỉ cần thiết", exact: true }).click();
  expect(await page.evaluate(key => localStorage.getItem(key), choiceKey)).toBe("denied");
  await page.reload();
  await page.getByRole("button", { name: "Tùy chọn quyền riêng tư", exact: true }).click();
  expect(scripts).toEqual([]);
  await page.getByRole("button", { name: "Cho phép phân tích", exact: true }).click();
  await expect.poll(() => scripts.length).toBe(1);
  await expect.poll(async () => (await events(page, "page_view")).length).toBe(1);
  expect(await page.evaluate(() => Object.prototype.toString.call(window.dataLayer?.[0]))).toBe("[object Arguments]");
  await context.addCookies([{ name: "_ga", value: "test-only", url: "http://127.0.0.1:3005" }]);
  await page.getByRole("button", { name: "Tùy chọn quyền riêng tư", exact: true }).click();
  await page.getByRole("button", { name: "Chỉ cần thiết", exact: true }).click();
  await expect(page.getByRole("button", { name: "Tùy chọn quyền riêng tư", exact: true })).toBeVisible();
  expect(await page.evaluate(key => localStorage.getItem(key), choiceKey)).toBe("denied");
  expect((await context.cookies()).filter(cookie => cookie.name.startsWith("_ga"))).toEqual([]);
  expect(scripts).toHaveLength(1);
  expect(await page.evaluate(() => window.dataLayer)).toBeUndefined();
});

test("real registration and login outcomes produce one conversion and no form data or URL query", async ({ page }) => {
  await configured(page);
  await page.goto("/vi?email=private%40example.com#secret");
  await page.getByRole("button", { name: "Cho phép phân tích", exact: true }).click();
  await expect.poll(async () => (await events(page, "page_view")).length).toBe(1);
  await page.locator(".story-actions .start-link").click();
  await expect(page).toHaveURL("/vi/register");
  await page.getByRole("button", { name: "Tạo tài khoản", exact: true }).click();
  expect(await events(page, "sign_up_attempt")).toHaveLength(0);
  await register(page);
  await expect(page).toHaveURL(/\/vi\/login\?email=/);
  await expect.poll(async () => (await events(page, "page_view")).length).toBe(3);
  expect(await events(page, "sign_up_click")).toHaveLength(1);
  expect(await events(page, "sign_up_attempt")).toHaveLength(1);
  expect(await events(page, "sign_up")).toHaveLength(1);
  const login = page.locator(".auth-login:visible");
  await login.getByLabel("Mật khẩu", { exact: true }).fill("password123");
  await login.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(page).toHaveURL("/vi/user");
  expect(await events(page, "login")).toHaveLength(1);
  expect(JSON.stringify(await events(page))).not.toMatch(/student|private|example\.com|password123|Nguyễn|email=|#secret/);
  expect((await events(page, "sign_up"))[0].parameters.method).toBe("email");
});

test("failed registration is an error signal and never a successful conversion", async ({ page, request }) => {
  await configured(page);
  await page.goto("/vi/register");
  await page.getByRole("button", { name: "Cho phép phân tích", exact: true }).click();
  await expect.poll(async () => (await events(page, "page_view")).length).toBe(1);
  await request.post(`${backend}/__status`, { data: { status: 503 } });
  await register(page);
  await expect(page.locator(".form-error")).toBeVisible();
  expect(await events(page, "sign_up_attempt")).toHaveLength(1);
  expect(await events(page, "sign_up")).toHaveLength(0);
  expect((await events(page, "auth_error"))[0].parameters).toMatchObject({ action: "register", error_type: "request_failed" });
  await page.evaluate(() => window.dispatchEvent(new ErrorEvent("error", { message: "private@example.com: confidential" })));
  expect((await events(page, "app_error"))[0].parameters.error_type).toBe("javascript");
  expect(JSON.stringify(await events(page))).not.toMatch(/private|confidential|@/);
});

test("mobile preferences are translated; locale navigation is measured once and storage failure preserves the form", async ({ page }, testInfo) => {
  await configured(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/register");
  const banner = page.getByRole("complementary", { name: "Help improve Jobbod" });
  await expect(banner).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await banner.screenshot({ path: testInfo.outputPath("analytics-mobile.png") });
  await page.getByRole("button", { name: "Allow analytics", exact: true }).click();
  await expect.poll(async () => (await events(page, "page_view")).length).toBe(1);
  await page.locator(".auth-brand").click();
  await expect(page).toHaveURL("/en");
  await expect.poll(async () => (await events(page, "page_view")).length).toBe(2);
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page.locator(".mobile-drawer-lang-btn").click();
  await page.getByRole("radio", { name: "Tiếng Việt Vietnamese" }).click();
  await expect(page).toHaveURL("/vi");
  await expect.poll(async () => (await events(page, "page_view")).length).toBe(3);
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error("storage blocked"); };
    Storage.prototype.setItem = () => { throw new Error("storage blocked"); };
  });
  await page.goto("/vi/register");
  await page.getByRole("button", { name: "Chỉ cần thiết", exact: true }).click();
  await register(page);
  await expect(page).toHaveURL(/\/vi\/login\?email=/);
  expect(await page.evaluate(() => window.dataLayer)).toBeUndefined();
});
