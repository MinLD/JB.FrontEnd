import './api-runtime.mjs';
import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
const { NextRequest } = await import('next/server');
const { clientApi, onSessionExpired } = await import('../src/services/client-api.ts');
const { serverApi } = await import('../src/services/server-api.ts');
const { serverActionApi } = await import('../src/services/server-action-api.ts');
const { apiRoute } = await import('../src/services/route-response.ts');
const { apiRequest } = await import('../src/services/api-request.ts');
const { GET: me } = await import('../src/app/api/auth/me/route.ts');
const { POST: login } = await import('../src/app/api/auth/login/route.ts');
const { POST: logout } = await import('../src/app/api/auth/logout/route.ts');
const { POST: refresh } = await import('../src/app/api/auth/refresh/route.ts');
const { POST: register } = await import('../src/app/api/auth/register/route.ts');
const { PUT: forward } = await import('../src/app/api/backend/[...path]/route.ts');
const auth = await import('../src/services/auth-service.ts');
const { proxy } = await import('../src/proxy.ts');

const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; delete globalThis.__apiTestCookies; });
const user = { id: '1', email: 'student@example.com', full_name: 'Nguyễn An', created_at: '2026-01-01T00:00:00Z' };
const envelope = (data, status = 200, code = 'SUCCESS', message = 'OK') => new Response(JSON.stringify({ code, message, data }), { status, headers: { 'Content-Type': 'application/json' } });
const jwt = (seconds = 900) => `header.${Buffer.from(JSON.stringify({ exp: Math.floor(Date.now()/1000) + seconds })).toString('base64url')}.signature`;
function cookieStore(values = {}) {
  const map = new Map(Object.entries(values)); const writes = [];
  const store = { get: name => map.has(name) ? { name, value: map.get(name) } : undefined,
    set(name, value, options) { writes.push({ name, value, options }); map.set(name, value); }, writes };
  globalThis.__apiTestCookies = store; return store;
}
const context = path => ({ params: Promise.resolve(path ? { path } : {}) });
function request(url, body, origin = 'http://localhost') {
  return new NextRequest(`http://localhost${url}`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
}
function withSession(url = '/api/auth/me') {
  return new NextRequest(`http://localhost${url}`, { headers: { cookie: `accessToken=${jwt()}; refreshToken=test-refresh; authRemember=1` } });
}
function assertResult(result, success, status) {
  assert.deepEqual(Object.keys(result).sort(), ['code', 'data', 'message', 'status', 'success']);
  assert.equal(result.success, success); assert.equal(result.status, status);
  assert.equal(typeof result.message, 'string');
  if (!success) assert.equal(result.data, null);
}

test('client, SSR and Server Action use the same paths/result and serialize body centrally', async () => {
  const calls = []; const access = jwt(); cookieStore({ accessToken: access, refreshToken: 'refresh-1' });
  globalThis.fetch = async (url, options) => { calls.push({ url, options }); return envelope(user); };
  assertResult(await clientApi('/api/profile/me'), true, 200);
  assert.equal(calls[0].url, '/api/backend/profile/me');
  assert.equal(new Headers(calls[0].options.headers).get('Authorization'), null);
  assertResult(await serverApi('/api/profile/me'), true, 200);
  assert.match(calls[1].url, /\/api\/profile\/me$/);
  assert.equal(new Headers(calls[1].options.headers).get('Authorization'), `Bearer ${access}`);
  assertResult(await serverActionApi('/api/profile/me', { method: 'PUT', body: { bio: 'Hello' } }), true, 200);
  assert.equal(calls[2].options.body, JSON.stringify({ bio: 'Hello' }));
  assert.equal(new Headers(calls[2].options.headers).get('cookie'), null);
});

test('expected API/network/JSON errors return results rather than rejecting promises', async () => {
  cookieStore({ accessToken: jwt() });
  for (const call of [() => clientApi('/api/profile/me'), () => serverApi('/api/profile/me'), () => serverActionApi('/api/profile/me')]) {
    globalThis.fetch = async () => envelope(null, 403, 'FORBIDDEN', 'Không có quyền.');
    const forbidden = await call(); assertResult(forbidden, false, 403); assert.equal(forbidden.code, 'FORBIDDEN');
    globalThis.fetch = async () => { throw new TypeError('network'); };
    assertResult(await call(), false, 503);
    globalThis.fetch = async () => new Response('42');
    assertResult(await call(), false, 502);
  }
  globalThis.fetch = async () => new Response(null, { status: 204 });
  assertResult(await apiRequest('/api/example', { method: 'DELETE' }), true, 204);
  const circular = {}; circular.self = circular;
  assertResult(await clientApi('/api/profile/me', { method: 'PUT', body: circular }), false, 400);
  assertResult(await clientApi('/api/profile/me', { body: {} }), false, 400);
  globalThis.fetch = async () => { throw new DOMException('Timeout', 'TimeoutError'); };
  assertResult(await clientApi('/api/profile/me'), false, 504);
  const controller = new AbortController(); controller.abort();
  assertResult(await clientApi('/api/profile/me', { signal: controller.signal }), false, 499);
  globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => { throw new DOMException('Timeout while reading body', 'TimeoutError'); } });
  assertResult(await clientApi('/api/profile/me'), false, 504);
});

test('client 401 notifies the auth provider; unsafe and inconsistent paths are rejected', async () => {
  let expired = 0; const unsubscribe = onSessionExpired(() => expired++);
  globalThis.fetch = async () => envelope(null, 401);
  await clientApi('/api/auth/me'); unsubscribe(); assert.equal(expired, 1);
  for (const call of [clientApi, serverApi, serverActionApi]) {
    for (const path of ['https://other.example/api/me', '/api/../auth/login', '/api/backend/profile/me']) assertResult(await call(path), false, 400);
  }
  assertResult(await serverActionApi('/api/auth/login', { method: 'POST', body: {} }), false, 400);
});

test('SSR never rotates tokens or writes cookies; actions persist rotations once for concurrent requests', async () => {
  const store = cookieStore({ accessToken: jwt(-1), refreshToken: `refresh-${Math.random()}`, authRemember: '1' });
  let rotations = 0;
  globalThis.fetch = async url => {
    if (url.endsWith('/api/auth/refresh')) { rotations++; return envelope({ access_token: jwt(1800), refresh_token: 'rotated-refresh', expires_in: 1800 }); }
    return envelope(user);
  };
  const ssr = await serverApi('/api/profile/me'); assertResult(ssr, false, 401); assert.equal(ssr.code, 'SESSION_REFRESH_REQUIRED');
  assert.equal(rotations, 0); assert.equal(store.writes.length, 0);
  assertResult(await serverApi('/api/profile/me', { method: 'PUT', body: {} }), false, 405);
  const results = await Promise.all(Array.from({ length: 5 }, () => serverActionApi('/api/profile/me')));
  results.forEach(result => assertResult(result, true, 200)); assert.equal(rotations, 1);
  assert.equal(store.get('refreshToken').value, 'rotated-refresh');
  assert.ok(store.writes.every(write => write.options.httpOnly));
  assert.ok(results.every(result => !JSON.stringify(result).includes('rotated-refresh')));
});

test('Server Actions clear rejected sessions, preserve outages and do not swallow Next control flow', async () => {
  let store = cookieStore({ accessToken: jwt(-1), refreshToken: `revoked-${Math.random()}` });
  globalThis.fetch = async () => envelope(null, 401);
  assertResult(await serverActionApi('/api/profile/me'), false, 401);
  assert.ok(store.writes.some(write => write.name === 'refreshToken' && write.options.maxAge === 0));
  store = cookieStore({ accessToken: jwt(-1), refreshToken: `outage-${Math.random()}` });
  globalThis.fetch = async () => envelope(null, 503);
  assertResult(await serverActionApi('/api/profile/me'), false, 503); assert.equal(store.writes.length, 0);
  cookieStore({ accessToken: jwt() });
  const control = Object.assign(new Error('Redirect'), { digest: 'NEXT_REDIRECT' });
  globalThis.fetch = async () => { throw control; };
  await assert.rejects(serverApi('/api/profile/me'), error => error === control);
});

test('apiRoute centralizes validation, JSON responses and safe unexpected errors', async () => {
  let forwarded = false;
  globalThis.fetch = async () => { forwarded = true; return envelope(user); };
  let response = await login(request('/api/auth/login', { email: 'wrong', password: '' }), context());
  assertResult(await response.json(), false, 422); assert.equal(forwarded, false);
  response = await login(request('/api/auth/login', {}, 'https://attacker.example'), context());
  assertResult(await response.json(), false, 403); assert.equal(forwarded, false);
  const route = apiRoute(async () => { throw new Error('sensitive internal error'); });
  response = await route(new NextRequest('http://localhost/api/test'), context());
  const body = await response.json(); assertResult(body, false, 500); assert.ok(!body.message.includes('sensitive'));
});

test('auth handlers only return safe data, keep cookies HttpOnly and normalize register/logout outcomes', async () => {
  globalThis.fetch = async (_url, options) => {
    assert.deepEqual(JSON.parse(options.body), { email: 'student@example.com', password: 'password123' });
    return envelope({ access_token: jwt(), refresh_token: 'private-refresh', expires_in: 900 });
  };
  let response = await login(request('/api/auth/login', { email: 'student@example.com', password: 'password123', rememberMe: true }), context());
  let result = await response.json(); assertResult(result, true, 200); assert.equal(result.data, null);
  assert.ok(!JSON.stringify(result).includes('private-refresh')); assert.match(response.headers.get('set-cookie'), /HttpOnly/);
  globalThis.fetch = async () => envelope({ access_token: jwt(), refresh_token: 'private-refresh', expires_in: 'invalid' });
  response = await login(request('/api/auth/login', { email: 'student@example.com', password: 'password123' }), context());
  assertResult(await response.json(), false, 502); assert.equal(response.headers.get('set-cookie'), null);
  globalThis.fetch = async () => envelope(user, 201);
  response = await register(request('/api/auth/register', { email: user.email, password: 'password123', full_name: user.full_name }), context());
  assertResult(await response.json(), true, 201);
  globalThis.fetch = async () => envelope(null, 401);
  const logoutRequest = new NextRequest('http://localhost/api/auth/logout', { method: 'POST', headers: { cookie: 'refreshToken=revoked', Origin: 'http://localhost' } });
  response = await logout(logoutRequest, context()); assertResult(await response.json(), true, 200);
  assert.match(response.headers.get('set-cookie'), /Max-Age=0/);
  response = await refresh(request('/api/auth/refresh'), context()); assertResult(await response.json(), false, 401);
});

test('route proxy shares session/error behavior, validates JSON centrally and blocks auth forwarding', async () => {
  globalThis.fetch = async () => envelope(user);
  let response = await me(withSession(), context()); assertResult(await response.json(), true, 200);
  const req = new NextRequest('http://localhost/api/backend/profile/me?full=1', { method: 'PUT', headers: { cookie: `accessToken=${jwt()}`, Origin: 'http://localhost' }, body: JSON.stringify({ bio: 'test' }) });
  globalThis.fetch = async (url, options) => { assert.match(url, /\/api\/profile\/me\?full=1$/); assert.equal(options.body, '{"bio":"test"}'); return envelope(user); };
  response = await forward(req, context(['profile', 'me'])); assertResult(await response.json(), true, 200);
  response = await forward(request('/api/backend/auth/login', {}), context(['auth', 'login'])); assertResult(await response.json(), false, 400);
});

test('rotated cookies survive a later upstream outage in actions and route handlers', async () => {
  const privateRefresh = 'new-private-refresh';
  const mock = async url => url.endsWith('/api/auth/refresh')
    ? envelope({ access_token: jwt(1800), refresh_token: privateRefresh, expires_in: 1800 })
    : envelope(null, 503);
  const store = cookieStore({ accessToken: jwt(-1), refreshToken: `action-outage-${Math.random()}` });
  globalThis.fetch = mock;
  const action = await serverActionApi('/api/profile/me'); assertResult(action, false, 503);
  assert.equal(store.get('refreshToken').value, privateRefresh);
  assert.ok(!JSON.stringify(action).includes(privateRefresh));
  const req = new NextRequest('http://localhost/api/auth/me', { headers: { cookie: `accessToken=${jwt(-1)}; refreshToken=route-outage-${Math.random()}` } });
  const response = await me(req, context()); const result = await response.json();
  assertResult(result, false, 503); assert.match(response.headers.get('set-cookie'), /new-private-refresh/);
  assert.ok(!JSON.stringify(result).includes(privateRefresh));
});

test('concurrent user loads share one request; settled requests are not a global profile cache', async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls++; return envelope(user); };
  const first = auth.getCurrentUser();
  const second = auth.getCurrentUser();
  assert.equal(first, second);
  assertResult(await second, true, 200);
  assert.equal(calls, 1);
  await auth.getCurrentUser();
  assert.equal(calls, 2);
});

test('login cancels old anonymous user loads so their 401 cannot clear the new session', async () => {
  let calls = 0; let resolveOld;
  globalThis.fetch = async (url, options) => {
    if (url.endsWith('/login')) return envelope(null);
    calls++;
    if (calls > 1) return envelope(user);
    return new Promise((resolve, reject) => {
      resolveOld = () => resolve(envelope(null, 401));
      options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
    });
  };
  let expired = 0;
  const unsubscribe = onSessionExpired(() => expired++);
  try {
    const old = auth.getCurrentUser();
    assertResult(await auth.login('student@example.com', 'password123', false), true, 200);
    const fresh = auth.getCurrentUser();
    assert.notEqual(old, fresh);
    assertResult(await old, false, 499);
    resolveOld();
    assertResult(await fresh, true, 200);
    assert.equal(calls, 2);
    assert.equal(expired, 0);
  } finally { unsubscribe(); }
});

test('navigation never fetches /me; missing cookies redirect and expired tokens rotate once', async () => {
  const calls = [];
  const rotatedAccess = jwt(1800);
  globalThis.fetch = async (url) => {
    calls.push(url);
    assert.ok(url.endsWith('/api/auth/refresh'));
    return envelope({ access_token: rotatedAccess, refresh_token: 'navigation-rotated', expires_in: 1800 });
  };
  assert.equal((await proxy(new NextRequest('http://localhost/user'))).headers.get('location'), 'http://localhost/vi/login');
  for (const path of ['/user', '/user/projects', '/login']) {
    const response = await proxy(withSession(path));
    assert.equal(response.status, 307);
    assert.equal(response.headers.get('location'), `http://localhost/vi${path === '/login' ? '/user' : path}`);
  }
  assert.equal(calls.length, 0);
  const req = new NextRequest('http://localhost/user', { headers: { cookie: `accessToken=${jwt(-1)}; refreshToken=navigation-expired-${Math.random()}; authRemember=1` } });
  const responses = await Promise.all(Array.from({ length: 3 }, () => proxy(req)));
  assert.equal(calls.length, 1);
  for (const response of responses) {
    assert.equal(response.status, 307);
    assert.match(response.headers.get('set-cookie'), /navigation-rotated/);
    assert.ok(response.headers.get('x-middleware-request-cookie').includes(rotatedAccess));
  }
});

test('navigation clears rejected rotations, preserves outages and never treats cookie presence as API authorization', async () => {
  const expired = () => new NextRequest('http://localhost/user', { headers: { cookie: `accessToken=${jwt(-1)}; refreshToken=nav-error-${Math.random()}` } });
  globalThis.fetch = async () => envelope(null, 401);
  let response = await proxy(expired());
  assert.equal(response.status, 307);
  assert.match(response.headers.get('set-cookie'), /Max-Age=0/);
  // A token with a future exp may pass navigation, but the data endpoint still validates it.
  const req = withSession();
  assert.equal((await proxy(req)).status, 307);
  response = await me(req, context());
  assertResult(await response.json(), false, 401);
  assert.match(response.headers.get('set-cookie'), /Max-Age=0/);
  globalThis.fetch = async () => envelope(null, 503);
  response = await proxy(expired());
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('set-cookie'), null);
});

test('localized page navigation enforces session gates and isolates cached language variants', async () => {
  for (const locale of ['vi', 'en']) {
    const denied = await proxy(new NextRequest(`http://localhost/${locale}/user/projects`));
    assert.equal(denied.status, 307);
    assert.equal(denied.headers.get('location'), `http://localhost/${locale}/login`);
    const signedIn = await proxy(withSession(`/${locale}/login`));
    assert.equal(signedIn.headers.get('location'), `http://localhost/${locale}/user`);
    const publicPage = await proxy(new NextRequest(`http://localhost/${locale}/about`));
    assert.equal(publicPage.status, 200);
    assert.equal(publicPage.headers.get('x-middleware-rewrite'), null);
  }
  const legacy = await proxy(new NextRequest('http://localhost/about?from=home', { headers: { cookie: 'jobbod_lang=en' } }));
  assert.equal(legacy.status, 307);
  assert.equal(legacy.headers.get('location'), 'http://localhost/en/about?from=home');
  assert.match(legacy.headers.get('cache-control'), /no-store/);
  assert.match(legacy.headers.get('vary'), /Cookie/);
  const invalid = await proxy(new NextRequest('http://localhost/', { headers: { cookie: 'jobbod_lang=invalid' } }));
  assert.equal(invalid.headers.get('location'), 'http://localhost/vi');
});
