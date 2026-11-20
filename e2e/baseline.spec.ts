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
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length, cookie: document.cookie }))).toEqual({ local: 1, session: 0, cookie: 'jobbod_lang=vi' });
  const stats = (await (await request.get(`${backend}/__stats`)).json()).data;
  expect(stats.lastHeaders.authorization).toMatch(/^Bearer /); expect(stats.lastHeaders.cookie).toBeNull();
  expect(userRequests).toBe(2); // Initial account load and the new session after login.
  const refreshed = await context.request.post('/api/auth/refresh');
  expect(refreshed.status()).toBe(200);
  expect(userRequests).toBe(2);
  await page.getByRole('button', { name: /^Đăng xuất/ }).click(); await expect(page).toHaveURL(/\/login$/);
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
for (const width of [1440, 390]) {
test(`registration validates, toasts success and prefills login at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('/register'); await page.getByRole('button', { name: 'Tạo tài khoản', exact: true }).click();
  await expect(page.getByLabel('Họ và tên', { exact: true })).toBeFocused();
  await page.getByLabel('Họ và tên', { exact: true }).fill('Nguyễn An'); await page.getByLabel('Email', { exact: true }).fill('student@example.com');
  await page.getByLabel('Mật khẩu', { exact: true }).fill('password123'); await page.getByRole('button', { name: 'Tạo tài khoản', exact: true }).click();
  await expect(page).toHaveURL('/vi/login?email=student%40example.com');
  await expect(page.getByText('Đăng ký thành công! Bạn có thể đăng nhập bằng tài khoản vừa tạo.', { exact: true })).toBeVisible();
  const loginForm = page.locator('.auth-login:visible');
  const brandColor = await loginForm.locator('.submit-button').evaluate(button => getComputedStyle(button).backgroundColor);
  await expect(loginForm.locator('.auth-intro h2 em')).toHaveCSS('color', brandColor);
  await expect(loginForm.locator('.auth-bottom a')).toHaveCSS('color', brandColor);
  await expect(loginForm.getByLabel('Email', { exact: true })).toHaveValue('student@example.com');
  await expect(loginForm.getByLabel('Mật khẩu', { exact: true })).toHaveValue('');
  await expect(page.locator('.success-message')).toHaveCount(0);
  await loginForm.getByLabel('Mật khẩu', { exact: true }).fill('password123');
  await loginForm.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page).toHaveURL(/\/user$/);
});
}
test('mobile landing assets honor their slots; FAQ is keyboard accessible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/');
  await expect(page.locator('.intro-loader-overlay')).toHaveCount(0);
  await page.getByRole('button', { name: 'Jobbod ghép cặp người dùng như thế nào?', exact: true }).click();
  const second = page.getByRole('button', { name: 'Bob giúp tôi làm gì?', exact: true }); await second.focus(); await page.keyboard.press('Enter');
  await expect(second).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('button', { name: 'Jobbod ghép cặp người dùng như thế nào?', exact: true })).toHaveAttribute('aria-expanded', 'false');
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('.photo-main img')).toHaveJSProperty('complete', true);
  const geometry = await page.locator('.photo-main img').evaluate(img => { const image = img.getBoundingClientRect(); const slot = img.parentElement!.getBoundingClientRect(); return { ratio: image.width / slot.width, heightRatio: image.height / slot.height }; });
  expect(geometry.ratio).toBeCloseTo(1, 1); expect(geometry.heightRatio).toBeCloseTo(1.0424, 1);
});
for (const width of [1440, 390]) {
  test(`public landing keeps approved logos and moves the team to About at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('.partner-organizations > li')).toHaveCount(3);
    await expect(page.locator('.founder-card')).toHaveCount(0);
    await expect(page.getByRole('img', { name: /Antler|Ventures|VinaCapital/ })).toHaveCount(0);
    for (const name of ['NTTU', 'NJEC', 'NIIC']) {
      const logo = page.getByRole('img', { name, exact: true });
      await logo.scrollIntoViewIfNeeded();
      await expect.poll(() => logo.evaluate(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)).toBe(true);
    }
    await page.locator('.partners-section').screenshot({ path: testInfo.outputPath('organizations.png') });
    await page.getByRole('navigation', { name: 'Thông tin Jobbod' }).getByRole('link', { name: 'Về chúng tôi', exact: true }).click();
    await expect(page).toHaveURL('/vi/about');
    const about = page.locator('.about-page:visible');
    await expect(about.locator('.founder-card')).toHaveCount(8);
    await expect(about.getByRole('heading', { name: 'Những người xây dựng Jobbod' })).toBeVisible();
    const mission = about.locator('.about-actions').getByRole('button', { name: 'Sứ mệnh của chúng tôi' });
    await mission.click();
    const dialog = page.getByRole('dialog', { name: 'Tuyên ngôn sứ mệnh của Jobbod' });
    await expect(dialog).toBeVisible();
    await dialog.screenshot({ path: testInfo.outputPath('mission.png') });
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(mission).toBeFocused();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await about.locator('.founders-section').scrollIntoViewIfNeeded();
    await page.evaluate(() => document.fonts.ready);
    await expect.poll(() => about.locator('.founder-portrait').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
    await page.screenshot({ path: testInfo.outputPath('about.png') });
  });
  test(`public policies are readable and linked from the footer at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.getByRole('navigation', { name: 'Thông tin Jobbod' }).getByRole('link', { name: 'Quyền riêng tư', exact: true }).click();
    await expect(page).toHaveURL('/vi/privacy');
    for (const [route, title] of [['privacy', 'Chính sách quyền riêng tư'], ['terms', 'Điều khoản sử dụng'], ['cookies', 'Chính sách Cookie']]) {
      await page.goto(`/${route}`);
      await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
      await expect(page).toHaveTitle(`${title} | Jobbod`);
      await expect(page.locator('.policy-body > section')).not.toHaveCount(0);
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await page.screenshot({ path: testInfo.outputPath('policy.png') });
  });
}
test('FAQ opens one answer at a time and supports closing with the keyboard', async ({ page }, testInfo) => {
  await page.goto('/');
  const first = page.getByRole('button', { name: 'Jobbod ghép cặp người dùng như thế nào?', exact: true });
  const second = page.getByRole('button', { name: 'Jobbod hoạt động như thế nào?', exact: true });
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  await second.focus(); await page.keyboard.press('Enter');
  await expect(second).toHaveAttribute('aria-expanded', 'true');
  await expect(first).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#faq-answer-0')).toHaveAttribute('aria-hidden', 'true');
  await page.keyboard.press('Enter');
  await expect(second).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.faq-item button[aria-expanded="true"]')).toHaveCount(0);
  await first.click();
  await page.locator('#faq').screenshot({ path: testInfo.outputPath('faq.png') });
});
for (const width of [1440, 390]) {
test(`story video waits for play, exposes controls and closes at ${width}px`, async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('/');
  await expect(page.locator('.story-section')).toHaveCount(1);
  await expect(page.locator('.dashboard-preview')).toHaveCount(0);
  const story = page.locator('.hero-preview .story-section');
  await story.scrollIntoViewIfNeeded();
  await expect(story.locator('.story-film')).toHaveCount(0);
  await expect(story.locator('.story-preview')).not.toHaveAttribute('src', /.+/);
  await expect(story.locator('.story-preview')).toHaveAttribute('poster', '/jobbod/video/jobbod-team-poster.jpg');
  await expect(story.locator('.story-caption')).toContainText('2:30');
  await expect(story.locator('.story-lettering')).toHaveAttribute('data-writing', 'complete');
  await expect(story.locator('.story-writing-pen')).toHaveCSS('opacity', '0');
  await page.evaluate(() => document.fonts.ready);
  await story.screenshot({ path: testInfo.outputPath('video.png') });
  await story.getByRole('button', { name: 'Phát video', exact: true }).click();
  const film = story.locator('.story-film');
  await expect(film).toHaveAttribute('src', '/jobbod/video/jobbod-team-150s.mp4');
  await expect(film).toHaveJSProperty('controls', true);
  await expect.poll(() => film.evaluate(video => (video as HTMLVideoElement).readyState)).toBeGreaterThan(0);
  await expect.poll(() => film.evaluate(video => (video as HTMLVideoElement).duration)).toBeCloseTo(150, 0);
  await expect(story.getByRole('alert')).toHaveCount(0);
  await story.getByRole('button', { name: 'Đóng video', exact: true }).click();
  await expect(film).toHaveCount(0);
  await expect(story.getByRole('button', { name: 'Phát video', exact: true })).toBeVisible();
  await story.getByRole('button', { name: 'Phát nền video', exact: true }).click();
  await expect(story.locator('.story-preview')).toHaveAttribute('src', '/jobbod/video/jobbod-team-preview.mp4');
  await expect.poll(() => story.locator('.story-preview').evaluate(video => (video as HTMLVideoElement).readyState)).toBeGreaterThan(0);
});
}

for (const locale of ['vi', 'en']) {
  for (const width of [1440, 390]) {
    test(`story handwriting draws once without shifting controls in ${locale} at ${width}px`, async ({ page }, testInfo) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.setViewportSize({ width, height: 960 });
      await page.goto(`/${locale}`);
      await expect(page.locator('.intro-loader-overlay')).toHaveCount(0, { timeout: 10000 });
      const story = page.locator('.story-section');
      await story.scrollIntoViewIfNeeded();
      const lettering = story.locator('.story-lettering');
      await expect(lettering).toHaveAttribute('data-writing', 'writing');
      await expect(story.locator('.story-writing-pen')).toHaveCSS('opacity', '1');
      const writingCenter = await story.locator('.story-lettering').evaluate(svg => {
        const visible = Array.from(svg.querySelectorAll<SVGPathElement>('[data-line="0"] [data-ink]')).filter(path => path.style.visibility !== 'hidden').map(path => path.getBoundingClientRect());
        const center = (Math.min(...visible.map(rect => rect.left)) + Math.max(...visible.map(rect => rect.right))) / 2;
        const rect = svg.getBoundingClientRect();
        return { center, expected: rect.x + rect.width / 2, tolerance: rect.width * .15 };
      });
      expect(Math.abs(writingCenter.center - writingCenter.expected)).toBeLessThan(writingCenter.tolerance);
      const before = await story.locator('.story-actions').boundingBox();
      await story.screenshot({ path: testInfo.outputPath('handwriting-in-progress.png') });
      await expect(lettering).toHaveAttribute('data-writing', 'complete', { timeout: 22000 });
      await expect(story.locator('.story-writing-pen')).toHaveCSS('opacity', '0');
      const after = await story.locator('.story-actions').boundingBox();
      expect(Math.abs(before!.y - after!.y)).toBeLessThan(1);
      await expect(story.getByRole('heading', { level: 2 })).toHaveAccessibleName(locale === 'vi' ? 'Có người cùng mình. Câu chuyện sẽ khác.' : 'Having someone by your side. The journey changes.');
      await story.screenshot({ path: testInfo.outputPath('handwriting-complete.png') });
      await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
      await story.scrollIntoViewIfNeeded();
      await expect(lettering).toHaveAttribute('data-writing', 'complete');
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  }
}

test('story handwriting immediately finishes when reduced motion is enabled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/en');
  await expect(page.locator('.intro-loader-overlay')).toHaveCount(0, { timeout: 10000 });
  await page.locator('.story-section').scrollIntoViewIfNeeded();
  const lettering = page.locator('.story-lettering');
  await expect(lettering).toHaveAttribute('data-writing', 'writing');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(lettering).toHaveAttribute('data-writing', 'complete');
  await expect(page.locator('.story-writing-pen')).toHaveCSS('opacity', '0');
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
      connectionPhoto: rect('.photo-scene'), connectionCopy: rect('.connection-copy'),
      bobScene: rect('.bob-scene'), bobCopy: rect('.bob-copy'),
      projectPhoto: rect('.project-photo'), projectCopy: rect('.project-copy'),
      matchingFirst: rect('.matching-grid > div:first-child'), matchingLast: rect('.matching-grid > div:last-child'),
      desktopMenu: getComputedStyle(document.querySelector('.site-header .desktop-nav')!).display,
      mobileMenu: getComputedStyle(document.querySelector('.site-header .mobile-toggle')!).display,
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
    expect(Math.abs(current.matchingFirst.y - current.matchingLast.y)).toBeLessThan(5);
    if (width <= 900) {
      expect(current.desktopMenu).toBe('none');
      expect(['inline-flex', 'flex']).toContain(current.mobileMenu);
    }
  }
});
test('Bob keeps its orbit background at desktop, tablet and mobile sizes', async ({ page }) => {
  await page.goto('/');
  for (const width of [1440, 900, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    const scene = page.locator('.bob-scene');
    await scene.scrollIntoViewIfNeeded();
    const orbit = page.locator('.bob-orbit img');
    await expect(orbit).toBeVisible();
    await expect.poll(() => orbit.evaluate(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)).toBe(true);
    await expect.poll(() => page.locator('.bob-character img').evaluate(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)).toBe(true);
    await expect.poll(() => scene.evaluate(element => {
      const scene = element.getBoundingClientRect();
      const orbit = element.querySelector('.bob-orbit')!.getBoundingClientRect();
      return Math.abs(orbit.width - scene.width);
    })).toBeLessThan(1);
    const geometry = await scene.evaluate(element => {
      const orbit = element.querySelector('.bob-orbit')!.getBoundingClientRect();
      const character = element.querySelector('.bob-character')!.getBoundingClientRect();
      return { ratio: character.width / orbit.width, left: orbit.left, right: orbit.right, viewport: innerWidth };
    });
    expect(geometry.ratio).toBeCloseTo(279 / 640, 2);
    expect(geometry.left).toBeGreaterThanOrEqual(0);
    expect(geometry.right).toBeLessThanOrEqual(geometry.viewport);
    expect(await page.locator('.landing-canvas').evaluate(element => getComputedStyle(element).zoom)).toBe('1');
  }
});
for (const width of [1440, 768, 390]) {
  test(`workflow releases its pin after revealing once at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await expect(page.locator('.intro-loader-overlay')).toHaveCount(0, { timeout: 10000 });
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.workflow-section')).toHaveAttribute('data-workflow-pinned', '');
    const stage = page.locator('.workflow-viewport');
    await expect.poll(() => stage.evaluate(element => element.parentElement!.classList.contains('pin-spacer'))).toBe(true);
    const range = await stage.evaluate(element => {
      const spacer = element.parentElement!;
      const top = Math.ceil(document.querySelector('.site-header .header-bar')!.getBoundingClientRect().bottom) + 12;
      return { start: spacer.getBoundingClientRect().top + scrollY - top, distance: spacer.offsetHeight - (element as HTMLElement).offsetHeight, top };
    });
    expect(range.distance).toBeGreaterThan(800);
    await page.evaluate(({ start, distance }) => scrollTo({ top: start + distance / 2, behavior: 'instant' }), range);
    await expect.poll(() => stage.evaluate(element => element.getBoundingClientRect().top)).toBeCloseTo(range.top, 0);
    await expect.poll(() => page.locator('.project-section').evaluate(element => element.getBoundingClientRect().top)).toBeGreaterThan(900);
    await page.evaluate(({ start, distance }) => scrollTo({ top: start + distance + 24, behavior: 'instant' }), range);
    await expect.poll(() => page.locator('.step-card').evaluateAll(cards => cards.every(card => Number(getComputedStyle(card).opacity) > .99))).toBe(true);
    const arrows = page.locator(width > 900 ? '.step-line [data-arrow-line]' : '.step-line-mobile [data-arrow-line]');
    await expect.poll(() => arrows.evaluateAll(lines => lines.every(line => Math.abs(parseFloat(getComputedStyle(line).strokeDashoffset)) < .01))).toBe(true);
    await expect(page.locator('.workflow-section')).not.toHaveAttribute('data-workflow-pinned', '');
    await expect(page.locator('.workflow .pin-spacer')).toHaveCount(0);
    const lastCard = await page.locator('.step-card').last().boundingBox();
    const stageBounds = await stage.boundingBox();
    expect(lastCard).not.toBeNull();
    expect(stageBounds).not.toBeNull();
    expect(lastCard!.y + lastCard!.height).toBeLessThanOrEqual(stageBounds!.y + stageBounds!.height + 1);
    expect(lastCard!.y).toBeGreaterThanOrEqual(range.top - 24);
    expect(lastCard!.y + lastCard!.height).toBeLessThanOrEqual(900);
    const beforeReverse = await stage.evaluate(element => ({ top: element.getBoundingClientRect().top, scroll: scrollY }));
    await page.evaluate(() => scrollBy({ top: -120, behavior: 'instant' }));
    await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(beforeReverse.scroll - 120, 0);
    await expect.poll(() => stage.evaluate(element => element.getBoundingClientRect().top)).toBeCloseTo(beforeReverse.top + 120, 0);
    await expect.poll(() => page.locator('.step-card').evaluateAll(cards => cards.every(card => Number(getComputedStyle(card).opacity) > .99))).toBe(true);
    await expect.poll(() => arrows.evaluateAll(lines => lines.every(line => Math.abs(parseFloat(getComputedStyle(line).strokeDashoffset)) < .01))).toBe(true);
    await page.setViewportSize({ width: width > 900 ? 768 : 1440, height: 900 });
    await expect(page.locator('.workflow-section')).not.toHaveAttribute('data-workflow-pinned', '');
    await expect(page.locator('.workflow .pin-spacer')).toHaveCount(0);
    await expect.poll(() => page.locator('.step-card').evaluateAll(cards => cards.every(card => Number(getComputedStyle(card).opacity) > .99))).toBe(true);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('.workflow-section')).not.toHaveAttribute('data-workflow-pinned', '');
    await expect(page.locator('.workflow .pin-spacer')).toHaveCount(0);
  });
}
test('landing, login and register share frosted backgrounds adapted to the screen', async ({ page }) => {
  for (const route of ['/', '/login', '/register']) {
    await page.goto(route);
    for (const width of [1440, 768, 390]) {
      await page.setViewportSize({ width, height: 900 });
      const asset = width > 1100 ? 'hero-frosted-network-4k.png' : width > 650 ? 'frosted-tablet.svg' : 'frosted-mobile.svg';
      await expect(page.locator('.frosted-background')).toHaveCSS('background-image', new RegExp(asset.replaceAll('.', '\\.')));
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
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
  await expect(page.locator('.hero-preview .story-section')).toHaveCount(1);
  await page.locator('.footer-wordmark').scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('.footer-wordmark img').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  expect(warnings).toEqual([]);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.getByRole('link', { name: 'Đăng nhập', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Đăng nhập Jobbod', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Jobbod — Trang chủ', exact: true }).click();
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
