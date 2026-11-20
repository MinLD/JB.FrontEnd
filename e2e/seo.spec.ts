import { test, expect } from "@playwright/test";
import sharp from "sharp";

const origin = "https://jobbod.net";
const publicPaths = ["", "/about", "/terms", "/privacy", "/cookies"];

test("public pages expose localized SEO metadata and crawlable content without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    for (const locale of ["vi", "en"]) {
      const descriptions = new Set<string>();
      for (const path of publicPaths) {
        const url = `${origin}/${locale}${path}`;
        const response = await page.goto(`/${locale}${path}?utm_source=seo-test`);
        expect(response!.status()).toBe(200);
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", url);
        for (const language of ["vi", "en", "x-default"]) {
          await expect(page.locator(`link[rel="alternate"][hreflang="${language}"]`)).toHaveAttribute("href", `${origin}/${language === "x-default" ? "vi" : language}${path}`);
        }
        const description = await page.locator('meta[name="description"]').getAttribute("content");
        expect(description).toBeTruthy();
        descriptions.add(description!);
        expect((await page.locator('meta[name="robots"]').getAttribute("content"))!.split(/,\s*/)).toContain("index");
        await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", url);
        await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", await page.title());
        await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", description!);
        await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", locale === "vi" ? "vi_VN" : "en_US");
        await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", `${origin}/jobbod/seo/social-cover-${locale}.jpg`);
        await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
      }
      expect(descriptions.size).toBe(5);
      await page.goto(`/${locale}`);
      const json = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
      expect(json["@graph"].map((entry: Record<string, unknown>) => entry["@type"])).toEqual(["Organization", "WebSite", "WebPage"]);
      expect(json["@graph"][2].url).toBe(`${origin}/${locale}`);
      expect(json["@graph"][2].inLanguage).toBe(locale);
    }
  } finally { await context.close(); }
});

test("auth pages are noindex and a missing URL keeps its 404 status", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    for (const locale of ["vi", "en"]) {
      for (const route of ["login", "register", "forgot-password"]) {
        await page.goto(`/${locale}/${route}`);
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
        await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
      }
      const denied = await request.get(`/${locale}/user`, { maxRedirects: 0 });
      expect(denied.status()).toBe(307);
      expect(denied.headers().location).toMatch(new RegExp(`/${locale}/login$`));
    }
    const missing = await page.goto("/vi/this-page-does-not-exist");
    expect(missing!.status()).toBe(404);
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
  } finally { await context.close(); }
});

test("robots, localized sitemap and social images are served at public URLs", async ({ request }) => {
  const robots = await request.get("/robots.txt", { maxRedirects: 0 });
  expect(robots.status()).toBe(200);
  const rules = await robots.text();
  expect(rules).toContain(`Sitemap: ${origin}/sitemap.xml`);
  expect(rules).toContain("Disallow: /api/");
  expect(rules).not.toMatch(/Disallow: \/(?:vi|en|_next|jobbod|login|register)/);
  const sitemap = await request.get("/sitemap.xml", { maxRedirects: 0 });
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  const urls = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g), match => match[1]);
  expect(urls.sort()).toEqual(publicPaths.flatMap(path => ["vi", "en"].map(locale => `${origin}/${locale}${path}`)).sort());
  expect(xml).toContain('hreflang="x-default"');
  expect(xml).not.toContain("<lastmod>");
  for (const locale of ["vi", "en"]) {
    const response = await request.get(`/jobbod/seo/social-cover-${locale}.jpg`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/jpeg");
    const image = await sharp(await response.body()).metadata();
    expect([image.width, image.height]).toEqual([1200, 630]);
  }
  const bot = await request.get("/en", { headers: { "User-Agent": "Twitterbot/1.0" } });
  const head = /<head>([\s\S]*?)<\/head>/.exec(await bot.text())?.[1];
  expect(head).toContain('property="og:title"');
  expect(head).toContain('name="twitter:card"');
});
