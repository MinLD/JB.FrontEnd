import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: "reduce" }); });

test("SSR sends localized content, metadata and favicon without requiring JavaScript", async ({ browser, request }) => {
  for (const [locale, heading, title] of [["vi", "Tìm đúng đồng đội", "Về chúng tôi"], ["en", "Find the right teammates", "About us"]]) {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`/${locale}`);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page).toHaveTitle(locale === "vi" ? "Jobbod – Tìm đồng đội làm dự án cho sinh viên" : "Jobbod – Find student teammates for real projects");
    await expect(page.locator("#hero-heading")).toContainText(heading);
    await expect(page.locator(".intro-loader-overlay")).not.toBeVisible();
    await page.goto(`/${locale}/about`);
    await expect(page).toHaveTitle(`${title} | Jobbod`);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", /\/en\/about$/);
    const icon = await page.locator('link[rel="icon"]').getAttribute("href");
    expect(icon).toMatch(/^\/icon\.png\?/);
    const image = await request.get(icon!);
    expect(image.status()).toBe(200);
    expect(image.headers()["content-type"]).toContain("image/png");
    expect((await image.body()).byteLength).toBeLessThan(5000);
    await context.close();
  }
  const english = await request.get("/", { headers: { Cookie: "jobbod_lang=en" } });
  expect(await english.text()).toContain('<html lang="en"');
  const redirect = await request.get("/", { headers: { Cookie: "jobbod_lang=en" }, maxRedirects: 0 });
  expect(redirect.status()).toBe(307);
  expect(redirect.headers()["cache-control"]).toContain("no-store");
  const invalid = await request.get("/", { headers: { Cookie: "jobbod_lang=invalid" } });
  expect(await invalid.text()).toContain('<html lang="vi"');
  expect((await request.get("/fr/about")).status()).toBe(404);
});

test("switching locale preserves the URL query and hash, persists on reload, and localizes all public pages", async ({ page }) => {
  await page.goto("/?campaign=demo#gioi-thieu");
  await page.locator(".header-lang-trigger").click();
  await page.getByRole("radio", { name: "English English" }).click();
  await expect(page).toHaveURL(/\/en\?campaign=demo#gioi-thieu$/);
  await expect(page.locator("#hero-heading:visible")).toContainText("Find the right teammates");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  for (const [route, heading] of [["terms", "Terms of service"], ["privacy", "Privacy policy"], ["cookies", "Cookie policy"], ["login", "Log in to Jobbod"], ["register", "Create your Jobbod account"], ["forgot-password", "Forgot your password?"]]) {
    await page.goto(`/en/${route}`);
    await expect(page.getByRole("heading", { level: 1, name: heading, exact: true })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveTitle(/Jobbod$/);
  }
  await page.goto("/en/register");
  await page.getByRole("button", { name: "Create account", exact: true }).click();
  await expect(page.getByLabel("Full name", { exact: true })).toBeFocused();
  await expect(page.getByText("Full name must be at least 2 characters.", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "Select language", exact: true }).click();
  await page.getByRole("radio", { name: "Tiếng Việt Vietnamese" }).click();
  await expect(page).toHaveURL(/\/vi\/register$/);
  await expect(page.getByRole("heading", { name: "Tạo tài khoản Jobbod" })).toBeVisible();
});

test("language switching works when localStorage and cookies are both unavailable", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  await context.addInitScript(() => {
    Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Unavailable", "SecurityError"); } });
    Object.defineProperty(document, "cookie", { get() { return ""; }, set() { throw new DOMException("Unavailable", "SecurityError"); } });
  });
  const page = await context.newPage();
  await page.goto("/vi");
  await page.locator(".header-lang-trigger").click();
  await page.getByRole("radio", { name: "English English" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("#hero-heading:visible")).toContainText("Find the right teammates");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "About us", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/about$/);
  await expect(page.getByRole("heading", { name: "One team. One shared beginning." })).toBeVisible();
  await context.close();
});

test("cross-tab changes and keyboard navigation select the correct locale", async ({ context, page }) => {
  await page.goto("/vi");
  await expect(page.locator(".intro-loader-overlay")).toHaveCount(0);
  const other = await context.newPage();
  await other.goto("/vi");
  await other.locator(".header-lang-trigger").click();
  const vietnamese = other.getByRole("radio", { name: "Tiếng Việt Vietnamese" });
  await vietnamese.focus();
  await other.keyboard.press("ArrowDown");
  await expect(other).toHaveURL(/\/en$/);
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("English login, onboarding and logout keep authentication protections intact", async ({ page, request }) => {
  await request.post("http://127.0.0.1:4319/__reset");
  const denied = await request.get("/en/user", { maxRedirects: 0 });
  expect(denied.status()).toBe(307);
  expect(denied.headers().location).toMatch(/\/en\/login$/);
  await page.goto("/en/login");
  await page.getByLabel("Email", { exact: true }).fill("student@example.com");
  await page.getByLabel("Password", { exact: true }).fill("password123");
  await page.getByRole("button", { name: "Show password", exact: true }).click();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/user$/);
  await expect(page.getByRole("heading", { name: "Hello! I'm Bob." })).toBeVisible();
  const account = await page.request.get("/en/user");
  expect(account.headers()["cache-control"]).toContain("no-store");
  expect(await account.text()).toContain('content="noindex, nofollow"');
  await page.getByRole("button", { name: "Get started with Bob", exact: true }).click();
  await expect(page.getByRole("button", { name: "02 Create profile", exact: true })).toHaveAttribute("aria-current", "step");
  await page.setViewportSize({ width: 320, height: 900 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Log out of account", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/login$/);
});

test("auth language picker sits at the top right, searches and dismisses without a back-home link", async ({ page }, testInfo) => {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["login", "register", "forgot-password"]) {
      await page.goto(`/vi/${route}`);
      await expect(page.getByRole("link", { name: /Về trang chủ|Back to home/ })).toHaveCount(0);
      const trigger = page.getByRole("button", { name: "Chọn ngôn ngữ", exact: true });
      const position = await trigger.boundingBox();
      expect(position!.x).toBeGreaterThan(width * .7);
      expect(position!.y + position!.height).toBeLessThan(110);
      await trigger.click();
      const dialog = page.getByRole("dialog", { name: "Chọn ngôn ngữ", exact: true });
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole("radio", { name: "Tiếng Việt Vietnamese" })).toHaveAttribute("aria-checked", "true");
      const bounds = await dialog.boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      const search = dialog.getByRole("searchbox", { name: "Tìm ngôn ngữ" });
      await expect(search).toBeFocused();
      await search.fill("unknown language");
      await expect(dialog.getByRole("radio")).toHaveCount(0);
      await search.fill("tieng viet");
      await expect(dialog.getByRole("radio", { name: "Tiếng Việt Vietnamese" })).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
      await trigger.click();
      await dialog.getByRole("searchbox").fill("English");
      await expect(dialog.getByRole("radio")).toHaveCount(1);
      await dialog.getByRole("radio", { name: "English English" }).click();
      await expect(page).toHaveURL(new RegExp(`/en/${route}$`));
      await expect(page.getByRole("button", { name: "Select language", exact: true })).toContainText("EN");
      if (route === "login" && width !== 320) {
        await page.getByRole("button", { name: "Select language", exact: true }).click();
        await page.screenshot({ path: testInfo.outputPath(`auth-language-${width}.png`), caret: "initial" });
        await page.keyboard.press("Escape");
      }
    }
  }
});
