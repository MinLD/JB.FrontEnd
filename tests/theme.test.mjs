import test from 'node:test';
import assert from 'node:assert/strict';
import { vi } from '../src/i18n/locales/vi.ts';
import { en } from '../src/i18n/locales/en.ts';
import { THEME_STORAGE_KEY, getNextTheme } from '../src/config/theme.ts';

test('theme configuration exports expected storage key and dictionary keys', () => {
  assert.equal(THEME_STORAGE_KEY, 'jobbod_theme');

  // Verify theme translation keys exist in both locales
  assert.ok(vi.header.theme_light);
  assert.ok(vi.header.theme_dark);
  assert.ok(vi.header.theme_toggle_aria);

  assert.ok(en.header.theme_light);
  assert.ok(en.header.theme_dark);
  assert.ok(en.header.theme_toggle_aria);

  assert.notEqual(vi.header.theme_light, '');
  assert.notEqual(vi.header.theme_dark, '');
  assert.notEqual(en.header.theme_light, '');
  assert.notEqual(en.header.theme_dark, '');
});

test('theme toggle logic resolves opposite theme correctly', () => {
  assert.equal(getNextTheme('light'), 'dark');
  assert.equal(getNextTheme('dark'), 'light');
});

test('dark mode 4k frosted assets and style variables are configured', async () => {
  const { designAssets, frostedBackgroundStyle } = await import('../src/config/design-assets.ts');

  assert.equal(designAssets.heroBackgroundDark.src, '/jobbod/design/hero-frosted-network-4k-dark.png');
  assert.equal(designAssets.heroBackgroundDark.width, 3840);
  assert.equal(designAssets.heroBackgroundDark.height, 2402);

  assert.equal(designAssets.heroBackgroundTabletDark.src, '/jobbod/illustrations/frosted-tablet-dark.svg');
  assert.equal(designAssets.heroBackgroundMobileDark.src, '/jobbod/illustrations/frosted-mobile-dark.svg');

  assert.ok(frostedBackgroundStyle['--frosted-desktop-dark'].includes('hero-frosted-network-4k-dark.png'));
  assert.ok(frostedBackgroundStyle['--frosted-tablet-dark'].includes('frosted-tablet-dark.svg'));
  assert.ok(frostedBackgroundStyle['--frosted-mobile-dark'].includes('frosted-mobile-dark.svg'));
});

test('dark mode mobile drawer styles are configured in globals.css', async () => {
  const fs = await import('node:fs');
  const css = fs.readFileSync('src/app/globals.css', 'utf8');

  assert.ok(css.includes('.mobile-drawer-footer'));
  assert.ok(css.includes('html.dark .mobile-drawer-footer'));
  assert.ok(css.includes(':root[data-theme="dark"] .mobile-drawer-footer'));
  assert.ok(css.includes('html.dark .intro-letter-glyph'));
});
