import { test, expect, type Page } from '@playwright/test';
const backend = 'http://127.0.0.1:4319';
async function login(page: Page) {
  await page.goto('/login');
  await page.getByLabel('Email', { exact: true }).fill('student@example.com');
  await page.getByLabel('Mật khẩu', { exact: true }).fill('password123');
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page).toHaveURL(/\/user$/);
}
test.beforeEach(async ({ request, page }) => { await request.post(`${backend}/__reset`); await page.emulateMedia({ reducedMotion: 'reduce' }); });

test('protected routes reject missing sessions; login and logout keep tokens out of browser responses', async ({ page, context, request }) => {
  let userRequests = 0;
  page.on('request', r => { if (new URL(r.url()).pathname === '/api/auth/me') userRequests++; });
  const anonymous = await request.get('/user', { maxRedirects: 0 }); expect(anonymous.status()).toBe(307);
  const response = page.waitForResponse(r => r.url().endsWith('/api/auth/login'));
  await login(page); expect((await (await response).json()).data).toBeNull();
  const cookies = (await context.cookies()).filter(c => ['accessToken', 'refreshToken', 'authRemember'].includes(c.name));
  expect(cookies).toHaveLength(3);
  for (const c of cookies) { expect(c.httpOnly).toBe(true); expect(c.secure).toBe(true); expect(c.sameSite).toBe('Lax'); }
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length, cookie: document.cookie }))).toEqual({ local: 0, session: 0, cookie: '' });
  const stats = (await (await request.get(`${backend}/__stats`)).json()).data;
  expect(stats.lastHeaders.authorization).toMatch(/^Bearer /); expect(stats.lastHeaders.cookie).toBeNull();
  expect(userRequests).toBe(2); // Initial account load and the new session after login.
  await page.getByRole('button', { name: 'Làm mới phiên', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Làm mới phiên thành công' })).toBeVisible();
  expect(userRequests).toBe(2);
  await page.getByRole('button', { name: 'Đăng xuất', exact: true }).click(); await expect(page).toHaveURL(/\/login$/);
  expect((await context.cookies()).filter(c => c.name === 'refreshToken')).toHaveLength(0);
  expect(userRequests).toBe(2);
});
test('parallel requests share one refresh; malformed upstream JSON becomes a controlled 502', async ({ page, context, request }) => {
  await login(page); await request.post(`${backend}/__expire`);
  const responses = await Promise.all(Array.from({ length: 5 }, () => context.request.get('/api/backend/profile/me')));
  expect(responses.map(r => r.status())).toEqual([200, 200, 200, 200, 200]);
  expect((await (await request.get(`${backend}/__stats`)).json()).data.refreshes).toBe(1);
  const malformed = await context.request.get('/api/backend/profile/malformed'); expect(malformed.status()).toBe(502);
  expect((await malformed.json()).message).toContain('không đúng định dạng');
});
test('outages preserve sessions, cross-site requests and auth forwarding are rejected', async ({ page, context, request }) => {
  await login(page);
  expect((await context.request.post('/api/auth/logout', { headers: { Origin: 'https://invalid.example' } })).status()).toBe(403);
  expect((await context.request.post('/api/backend/auth/login', { data: {} })).status()).toBe(400);
  await request.post(`${backend}/__status`, { data: { status: 503 } });
  expect((await context.request.get('/api/auth/me')).status()).toBe(503);
  expect((await context.cookies()).some(c => c.name === 'refreshToken')).toBe(true);
  await request.post(`${backend}/__status`, { data: { status: 200 } }); await request.post(`${backend}/__revoke`);
  expect((await context.request.post('/api/auth/refresh')).status()).toBe(401);
  expect((await context.cookies()).some(c => c.name === 'refreshToken')).toBe(false);
});
test('forms validate and registration succeeds against the mock backend', async ({ page }) => {
  await page.goto('/register'); await page.getByRole('button', { name: 'Tạo tài khoản', exact: true }).click();
  await expect(page.getByLabel('Họ và tên', { exact: true })).toBeFocused();
  await page.getByLabel('Họ và tên', { exact: true }).fill('Nguyễn An'); await page.getByLabel('Email', { exact: true }).fill('student@example.com');
  await page.getByLabel('Mật khẩu', { exact: true }).fill('password123'); await page.getByRole('button', { name: 'Tạo tài khoản', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Đăng ký thành công' })).toBeVisible();
});
test('mobile landing assets honor their slots; FAQ is keyboard accessible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/');
  await expect(page.locator('.intro-loader-overlay')).toHaveCount(0);
  await page.getByRole('button', { name: 'Jobbod AI dành cho ai?', exact: true }).click();
  const second = page.getByRole('button', { name: 'Bob giúp tôi làm gì?', exact: true }); await second.focus(); await page.keyboard.press('Enter');
  await expect(second).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('button', { name: 'Jobbod AI dành cho ai?', exact: true })).toHaveAttribute('aria-expanded', 'false');
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('.photo-main img')).toHaveJSProperty('complete', true);
  const geometry = await page.locator('.photo-main img').evaluate(img => { const image = img.getBoundingClientRect(); const slot = img.parentElement!.getBoundingClientRect(); return { ratio: image.width / slot.width, heightRatio: image.height / slot.height }; });
  expect(geometry.ratio).toBeCloseTo(1, 1); expect(geometry.heightRatio).toBeCloseTo(1.0424, 1);
});
test('landing adapts responsively without horizontal overflow; keeps 3-column matching and enables mobile nav', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto('/');
  await expect(page.locator('.intro-loader-overlay')).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready);
  const measure = () => page.evaluate(() => {
    const rect = (selector: string) => {
      const element = document.querySelector(selector);
      if (!element) throw new Error(`Missing ${selector}`);
      const r = element.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    };
    return {
      viewport: document.querySelector<HTMLElement>('.landing-viewport')!.clientWidth,
      pageWidth: document.documentElement.scrollWidth,
      canvas: rect('.landing-canvas'),
      heading: rect('.hero h1'),
      project: rect('.project-card'),
      profile: rect('.founder-card'),
      connectionPhoto: rect('.photo-scene'), connectionCopy: rect('.connection-copy'),
      bobScene: rect('.bob-scene'), bobCopy: rect('.bob-copy'),
      projectPhoto: rect('.project-photo'), projectCopy: rect('.project-copy'),
      matchingFirst: rect('.matching-grid > div:first-child'), matchingLast: rect('.matching-grid > div:last-child'),
      desktopMenu: getComputedStyle(document.querySelector('.landing-header .desktop-nav')!).display,
      mobileMenu: getComputedStyle(document.querySelector('.landing-header .mobile-toggle')!).display,
    };
  });
  const desktop = await measure();
  expect(desktop.desktopMenu).toBe('flex');
  expect(desktop.mobileMenu).toBe('none');
  expect(Math.abs(desktop.matchingFirst.y - desktop.matchingLast.y)).toBeLessThan(2);

  for (const width of [1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 960 });
    await expect.poll(async () => (await measure()).pageWidth).toBeLessThanOrEqual(width);
    const current = await measure();
    expect(current.heading.width).toBeLessThanOrEqual(width);
    expect(current.project.width).toBeLessThanOrEqual(width);
    // Keep 3 columns on matching grid side-by-side as requested
    expect(Math.abs(current.matchingFirst.y - current.matchingLast.y)).toBeLessThan(5);
    if (width <= 900) {
      expect(current.desktopMenu).toBe('none');
      expect(['inline-flex', 'flex']).toContain(current.mobileMenu);
    }
  }
});
test('intro completes without leaving the navbar hidden during client navigation', async ({ page }) => {
  const warnings: string[] = [];
  page.on('console', message => {
    if (/not eligible for reset|has either width or height modified/.test(message.text())) warnings.push(message.text());
  });
  await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.goto('/');
  await expect(page.locator('.intro-loader-overlay')).toHaveCount(0, { timeout: 10000 });
  await expect(page.locator('#header-brand-logo')).toHaveCSS('opacity', '1');
  const preview = await page.locator('.hero-preview').boundingBox();
  if (!preview) throw new Error('Missing product preview');
  await page.mouse.move(preview.x + preview.width / 2, preview.y + 40, { steps: 8 });
  const scale = () => page.locator('.hero-preview-surface').evaluate(element => {
    const matrix = new DOMMatrix(getComputedStyle(element).transform);
    return Math.hypot(matrix.m11, matrix.m12, matrix.m13);
  });
  await expect.poll(scale).toBeGreaterThan(1.01);
  await page.mouse.move(0, 0, { steps: 8 });
  await expect.poll(scale).toBeCloseTo(1, 2);
  await page.locator('.footer-wordmark').scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('.footer-wordmark img').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  expect(warnings).toEqual([]);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.getByRole('link', { name: 'Đăng nhập', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Đăng nhập Jobbod', exact: true })).toBeVisible();
  await page.getByRole('link', { name: /Về trang chủ/ }).click();
  await expect(page.getByRole('heading', { name: /Tìm đúng đồng đội/ })).toBeVisible();
  const scrollLanding = async () => {
    await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).overflowY)).not.toBe('hidden');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.mouse.move(100, 300);
    await page.mouse.wheel(0, 640);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  };
  await scrollLanding();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Đăng nhập Jobbod', exact: true })).toBeVisible();
  await page.goForward();
  await expect(page.getByRole('heading', { name: /Tìm đúng đồng đội/ })).toBeVisible();
  await scrollLanding();
});
