import test from 'node:test';
import assert from 'node:assert/strict';
import { createPageMetadata, createRobots, createSitemap, homeStructuredData, serializeStructuredData } from '../src/config/seo.ts';
import { vi } from '../src/i18n/locales/vi.ts';
import { en } from '../src/i18n/locales/en.ts';

test('each locale has unique public descriptions, absolute canonical URLs and reciprocal language alternates', () => {
  const pages = [['home', ''], ['about', '/about'], ['terms', '/terms'], ['privacy', '/privacy'], ['cookies', '/cookies']];
  for (const [locale, dictionary] of [['vi', vi], ['en', en]]) {
    const descriptions = [];
    for (const [key, path] of pages) {
      const metadata = createPageMetadata(key, locale, dictionary);
      const canonical = `https://jobbod.net/${locale}${path}`;
      assert.equal(metadata.alternates.canonical, canonical);
      assert.deepEqual(metadata.alternates.languages, { vi: `https://jobbod.net/vi${path}`, en: `https://jobbod.net/en${path}`, 'x-default': `https://jobbod.net/vi${path}` });
      assert.equal(metadata.robots.index, true);
      assert.equal(metadata.openGraph.url, canonical);
      assert.equal(metadata.openGraph.description, metadata.description);
      assert.equal(metadata.openGraph.locale, locale === 'vi' ? 'vi_VN' : 'en_US');
      assert.equal(metadata.twitter.card, 'summary_large_image');
      assert.equal(metadata.openGraph.images[0].url, `https://jobbod.net/jobbod/seo/social-cover-${locale}.jpg`);
      assert.ok(metadata.description.trim().length > 0);
      descriptions.push(metadata.description);
    }
    assert.equal(new Set(descriptions).size, pages.length);
  }
});

test('account and authentication pages cannot inherit indexable robots metadata', () => {
  for (const [locale, dictionary] of [['vi', vi], ['en', en]]) {
    for (const [key, path] of [['login', '/login'], ['register', '/register'], ['forgot', '/forgot-password'], ['user', '/user']]) {
      const metadata = createPageMetadata(key, locale, dictionary);
      assert.equal(metadata.robots.index, false);
      assert.equal(metadata.robots.follow, key !== 'user');
      assert.equal(metadata.robots.googleBot, undefined);
      assert.equal(metadata.alternates.languages, undefined);
      assert.equal(metadata.alternates.canonical, `https://jobbod.net/${locale}${path}`);
    }
  }
});

test('sitemap contains only the ten canonical public URLs and robots lets crawlers see noindex pages', () => {
  const sitemap = createSitemap();
  const expected = ['', '/about', '/terms', '/privacy', '/cookies'].flatMap(path => ['vi', 'en'].map(locale => `https://jobbod.net/${locale}${path}`));
  assert.deepEqual(sitemap.map(entry => entry.url).sort(), expected.sort());
  assert.equal(new Set(sitemap.map(entry => entry.url)).size, 10);
  for (const entry of sitemap) {
    assert.equal(entry.lastModified, undefined, 'Do not invent modification dates at build time');
    assert.ok(Object.values(entry.alternates.languages).includes(entry.url));
  }
  const robots = createRobots();
  assert.equal(robots.sitemap, 'https://jobbod.net/sitemap.xml');
  assert.deepEqual(robots.rules, { userAgent: '*', allow: '/', disallow: ['/api/'] });
});

test('home schema uses verified organization data and safely embeds localized text', () => {
  const data = homeStructuredData('en', en);
  const [organization, website, page] = data['@graph'];
  assert.equal(organization.name, 'Jobbod');
  assert.equal(organization.logo.url, 'https://jobbod.net/jobbod/brand-mark.png');
  assert.equal(website['@id'], page.isPartOf['@id']);
  assert.equal(page.url, 'https://jobbod.net/en');
  assert.equal(page.inLanguage, 'en');
  assert.equal(page.description, en.metadata.home_description);
  const unsafe = { ...en, metadata: { ...en.metadata, home_description: '</script><script>alert(1)</script>' } };
  const serialized = serializeStructuredData(homeStructuredData('en', unsafe));
  assert.equal(serialized.includes('<'), false);
  assert.equal(JSON.parse(serialized)['@graph'][2].description, unsafe.metadata.home_description);
  assert.equal('aggregateRating' in organization, false);
});
