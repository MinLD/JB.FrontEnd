import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_LOCALE,
  SUPPORTED_LANGUAGES,
  DICTIONARIES,
  getTranslation,
  isValidLocale,
} from '../src/i18n/config.ts';
import { vi } from '../src/i18n/locales/vi.ts';
import { en } from '../src/i18n/locales/en.ts';
import { getLandingFaq, getTeamGroups } from '../src/config/landing.ts';
import { localePath, parseLocalePath } from '../src/i18n/settings.ts';
import { translate } from '../src/i18n/translate.ts';
import { getPolicy } from '../src/config/policies.ts';
import { createAuthSchemas } from '../src/lib/validations/auth.ts';
import { authErrorMessage } from '../src/i18n/auth-errors.ts';
import { getStoryLettering } from '../src/config/story-lettering.ts';

test('i18n configuration contains supported locales with complete metadata', () => {
  assert.equal(DEFAULT_LOCALE, 'vi');
  assert.equal(SUPPORTED_LANGUAGES.length, 2);
  assert.equal(DICTIONARIES.vi, vi);
  assert.equal(DICTIONARIES.en, en);

  const viOpt = SUPPORTED_LANGUAGES.find(l => l.code === 'vi');
  const enOpt = SUPPORTED_LANGUAGES.find(l => l.code === 'en');

  assert.ok(viOpt);
  assert.equal(viOpt.short, 'VI');
  assert.equal(viOpt.label, 'Tiếng Việt');

  assert.ok(enOpt);
  assert.equal(enOpt.short, 'EN');
  assert.equal(enOpt.label, 'English');
});

test('isValidLocale validates allowed locales correctly', () => {
  assert.equal(isValidLocale('vi'), true);
  assert.equal(isValidLocale('en'), true);
  assert.equal(isValidLocale('fr'), false);
  assert.equal(isValidLocale(''), false);
  assert.equal(isValidLocale(null), false);
  assert.equal(isValidLocale(undefined), false);
  assert.equal(isValidLocale(123), false);
});

test('both Vietnamese and English dictionaries have complete non-empty keys across all sections', () => {
  function getDeepKeys(obj, prefix = '') {
    let keys = [];
    for (const [k, v] of Object.entries(obj)) {
      const full = prefix ? `${prefix}.${k}` : k;
      if (typeof v === 'object' && v !== null) {
        keys = keys.concat(getDeepKeys(v, full));
      } else {
        keys.push(full);
      }
    }
    return keys;
  }

  const viKeys = getDeepKeys(vi).sort();
  const enKeys = getDeepKeys(en).sort();

  assert.deepEqual(viKeys, enKeys, 'Both locales must have the exact same set of translation keys');

  for (const key of viKeys) {
    const viVal = getTranslation('vi', key);
    const enVal = getTranslation('en', key);
    assert.ok(typeof viVal === 'string' && viVal.trim().length > 0, `VI key ${key} should not be empty`);
    assert.ok(typeof enVal === 'string' && enVal.trim().length > 0, `EN key ${key} should not be empty`);
  }
});

test('getTranslation returns correct landing page translations in both languages', () => {
  // Vietnamese Hero & Sections
  assert.equal(getTranslation('vi', 'hero.title_line1_pre'), 'Tìm đúng ');
  assert.equal(getTranslation('vi', 'hero.title_line1_em'), 'đồng đội');
  assert.equal(getTranslation('vi', 'hero.cta'), 'Trò chuyện với Bob');
  assert.equal(getTranslation('vi', 'story.eyebrow'), 'MỖI KẾT NỐI, MỘT KHỞI ĐẦU.');
  assert.equal(getTranslation('vi', 'story.start_with_bob'), 'Bắt đầu cùng Bob');
  assert.equal(getTranslation('vi', 'bob.cta'), 'Trò chuyện với Bob');
  assert.equal(getTranslation('vi', 'footer.tagline'), 'Dành cho sinh viên. Cùng xây dựng dự án thật.');

  // English Hero & Sections
  assert.equal(getTranslation('en', 'hero.title_line1_pre'), 'Find the right ');
  assert.equal(getTranslation('en', 'hero.title_line1_em'), 'teammates');
  assert.equal(getTranslation('en', 'hero.cta'), 'Chat with Bob');
  assert.equal(getTranslation('en', 'story.eyebrow'), 'EVERY CONNECTION, A NEW START.');
  assert.equal(getTranslation('en', 'story.start_with_bob'), 'Get started with Bob');
  assert.equal(getTranslation('en', 'bob.cta'), 'Chat with Bob');
  assert.equal(getTranslation('en', 'footer.tagline'), 'For students. Building real projects together.');
});

test('getLandingFaq returns 12 questions and answers in corresponding locale', () => {
  const viFaq = getLandingFaq('vi');
  const enFaq = getLandingFaq('en');

  assert.equal(viFaq.length, 12);
  assert.equal(enFaq.length, 12);

  assert.equal(viFaq[0].question, 'Jobbod ghép cặp người dùng như thế nào?');
  assert.equal(enFaq[0].question, 'How does Jobbod match users?');

  for (let i = 0; i < 12; i++) {
    assert.ok(viFaq[i].question.length > 0 && viFaq[i].answer.length > 0);
    assert.ok(enFaq[i].question.length > 0 && enFaq[i].answer.length > 0);
  }
});

test('getTeamGroups returns localized founder and advisor descriptions', () => {
  const viTeam = getTeamGroups('vi');
  const enTeam = getTeamGroups('en');

  assert.equal(viTeam.length, 3);
  assert.equal(enTeam.length, 3);

  assert.equal(viTeam[0].title, 'Nhà sáng lập');
  assert.equal(enTeam[0].title, 'Founders');
});

test('getTranslation falls back to default locale or key if missing', () => {
  assert.equal(getTranslation('unknown', 'header.login'), 'Đăng nhập');
  assert.equal(getTranslation('en', 'nonexistent.key'), 'nonexistent.key');
});

test('handwritten artwork matches the current Vietnamese and English story headings', () => {
  for (const [locale, dictionary] of [['vi', vi], ['en', en]]) {
    const lettering = getStoryLettering(locale);
    assert.deepEqual(lettering.lines.map(line => line.text), [dictionary.story.heading_line1, dictionary.story.heading_line2], 'Regenerate story lettering after editing its translations');
    assert.ok(lettering.lines.every(line => line.glyphs.length > 0));
  }
});

test('locale paths replace only supported prefixes and preserve query, hash, and external links', () => {
  for (const [input, locale, expected] of [
    ['/', 'en', '/en'], ['/vi/login?email=a%40b.test#form', 'en', '/en/login?email=a%40b.test#form'],
    ['/en/about', 'vi', '/vi/about'], ['/english', 'vi', '/vi/english'],
    ['https://example.test/path', 'en', 'https://example.test/path'], ['//example.test/path', 'en', '//example.test/path'],
    ['#faq', 'en', '#faq'], ['/en?campaign=1#faq', 'vi', '/vi?campaign=1#faq'],
    ['/?campaign=1#faq', 'en', '/en?campaign=1#faq'],
  ]) assert.equal(localePath(input, locale), expected);
  assert.deepEqual(parseLocalePath('/enough'), { locale: undefined, pathname: '/enough' });
});

test('interpolation remains plain text and translation lookup does not expose prototype properties', () => {
  assert.equal(translate(en, 'auth.limit', { label: '<script>', max: 12 }), '<script> must be at most 12 characters.');
  assert.equal(translate(en, 'auth.limit'), '{label} must be at most {max} characters.');
  assert.equal(translate(en, '__proto__.toString'), '__proto__.toString');
  assert.equal(translate(en, 'auth.toString'), 'auth.toString');
});

test('each policy has translated content and matching sections', () => {
  for (const kind of ['terms', 'privacy', 'cookies']) {
    const viPolicy = getPolicy(kind, 'vi');
    const enPolicy = getPolicy(kind, 'en');
    assert.notEqual(enPolicy.title, viPolicy.title);
    assert.notEqual(enPolicy.introduction, viPolicy.introduction);
    assert.equal(enPolicy.sections.length, viPolicy.sections.length);
    for (const [index, section] of enPolicy.sections.entries()) {
      assert.ok(section.title.trim() && section.text.trim());
      assert.notEqual(section.text, viPolicy.sections[index].text);
    }
  }
});

test('localized form validation keeps the API limits and translates all error paths', () => {
  for (const dictionary of [vi, en]) {
    const t = key => translate(dictionary, key);
    const { loginSchema, registerSchema } = createAuthSchemas(t);
    assert.equal(loginSchema.safeParse({ email: '', password: '' }).error.issues[0].message, dictionary.auth.email_required);
    assert.equal(registerSchema.safeParse({ email: 'student@example.com', full_name: 'Test Student', password: 'short' }).error.issues[0].message, dictionary.auth.password_min);
    assert.equal(registerSchema.safeParse({ email: 'student@example.com', full_name: 'Test Student', password: 'x'.repeat(129) }).success, false);
    assert.equal(registerSchema.safeParse({ email: ' student@example.com ', full_name: ' Test Student ', password: 'password123' }).success, true);
    for (const [status, key] of [[401, 'invalid_credentials'], [409, 'email_exists'], [429, 'rate_limit'], [503, 'service_unavailable'], [0, 'service_unavailable'], [400, 'request_error']]) {
      assert.equal(authErrorMessage({ status }, t), dictionary.auth[key]);
    }
  }
});
