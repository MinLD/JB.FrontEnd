import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { measurementId, googleVerification } from '../src/config/measurement.ts';
import { analyticsChoice, measurementPage, referrerOrigin, startAnalytics, stopAnalytics, trackAnalytics, trackPage } from '../src/lib/analytics.ts';

afterEach(() => {
  stopAnalytics();
  delete globalThis.window;
  delete globalThis.document;
  delete globalThis.localStorage;
});

function browser(pathname = '/vi/register') {
  globalThis.window = { location: { pathname, search: '?email=private@example.com', hash: '#secret' } };
  globalThis.document = { referrer: 'https://search.example/results?email=private@example.com', cookie: '' };
  globalThis.localStorage = { getItem: () => null };
  window.gtag = (...args) => { (window.dataLayer ??= []).push(args); };
}

test('measurement configuration rejects missing values, scripts and non-GA4 IDs', () => {
  for (const value of [undefined, '', 'UA-12345', 'G-abc123', 'G-ABC123&x=<script>']) assert.equal(measurementId(value), null);
  assert.equal(measurementId(' G-TEST123456 '), 'G-TEST123456');
  assert.equal(googleVerification('valid_verification-token123'), 'valid_verification-token123');
  for (const value of [undefined, '', '<meta name="google-site-verification">']) assert.equal(googleVerification(value), undefined);
});

test('measurement allows known localized routes and discards queries, fragments and unknown slugs', () => {
  assert.equal(measurementPage('/vi/'), '/vi');
  assert.equal(measurementPage('/en/about'), '/en/about');
  for (const path of ['/login', '/vi/login?email=private@example.com', '/en#secret', '/en/profile/private@example.com', '//elsewhere.test/vi']) assert.equal(measurementPage(path), null);
  assert.equal(referrerOrigin('https://search.example/path?email=private@example.com#secret'), 'https://search.example');
  assert.equal(referrerOrigin('javascript:alert(1)'), '');
  assert.equal(referrerOrigin('not a URL'), '');
});

test('unconfigured tracking is inert and unavailable storage never grants consent', () => {
  browser();
  assert.equal(analyticsChoice(), null);
  globalThis.localStorage.getItem = () => { throw new Error('blocked'); };
  assert.equal(analyticsChoice(), null);
  trackPage('/vi'); trackAnalytics('sign_up');
  assert.equal(window.dataLayer, undefined);
  assert.equal(startAnalytics('invalid'), false);
  assert.equal(window.dataLayer, undefined);
});

test('configured tracking deduplicates route renders and sends only allowlisted event fields', () => {
  browser();
  assert.equal(startAnalytics('G-TEST123456'), true);
  const commands = () => window.dataLayer.map(command => Array.from(command));
  assert.equal(startAnalytics('G-TEST123456'), true);
  assert.equal(commands().filter(command => command[0] === 'config').length, 1);
  const config = commands().find(command => command[0] === 'config')[2];
  assert.equal(config.send_page_view, false);
  assert.equal(config.allow_google_signals, false);
  assert.equal(config.cookie_domain, 'none');
  trackPage('/vi/register'); trackPage('/vi/register'); trackPage('/en/register'); trackPage('/vi/register');
  assert.equal(commands().filter(command => command[1] === 'page_view').length, 3);
  trackAnalytics('auth_error', { action: 'register', error_type: 'request_failed', email: 'private@example.com', message: 'private failure' });
  trackAnalytics('sign_up');
  const event = commands().find(command => command[1] === 'auth_error')[2];
  assert.equal(event.action, 'register');
  assert.equal(event.error_type, 'request_failed');
  assert.equal(event.page_location, 'https://jobbod.net/vi/register');
  assert.equal(commands().find(command => command[1] === 'sign_up')[2].method, 'email');
  assert.doesNotMatch(JSON.stringify(commands()), /private|@|secret|results\?/);
  stopAnalytics();
  const count = commands().length;
  trackAnalytics('sign_up'); trackPage('/vi');
  assert.equal(commands().length, count);
  assert.equal(window['ga-disable-G-TEST123456'], true);
});

test('broken analytics cannot break registration or navigation', () => {
  browser(); startAnalytics('G-TEST123456');
  window.gtag = () => { throw new Error('blocked tag'); };
  assert.doesNotThrow(() => trackAnalytics('sign_up'));
  assert.doesNotThrow(() => trackPage('/en'));
  Object.defineProperty(document, 'cookie', { get() { throw new Error('cookies blocked'); } });
  assert.doesNotThrow(() => stopAnalytics());
  assert.equal(window['ga-disable-G-TEST123456'], true);
});
