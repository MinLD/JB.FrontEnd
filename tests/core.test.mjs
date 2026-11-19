import test from 'node:test';
import assert from 'node:assert/strict';
import { isApiEnvelope, getResponseMessage } from '../src/lib/api-envelope.ts';
import { getJwtExpiration, shouldRefreshJwtToken } from '../src/services/auth-token.ts';
import { loginSchema, registerAccountSchema } from '../src/lib/validations/auth.ts';

test('API envelope rejects primitive, array, and malformed JSON shapes', () => {
  for (const body of [null, false, 42, 'ok', [], {}, { data: {} }, { code: 'OK', message: {}, data: {} }]) assert.equal(isApiEnvelope(body), false);
  assert.equal(isApiEnvelope({ code: 'SUCCESS', message: 'OK', data: null }), true);
  assert.equal(isApiEnvelope({ code: 'SUCCESS', message: 'OK', data: { id: '1' } }), true);
});
test('upstream error messages must be usable strings', () => {
  for (const body of [null, 42, 'error', {}, { message: [] }, { message: ' ' }]) assert.equal(getResponseMessage(body, 'Fallback'), 'Fallback');
  assert.equal(getResponseMessage({ message: 'Email đã tồn tại.' }, 'Fallback'), 'Email đã tồn tại.');
});
test('JWT expiry schedules refresh without granting access', () => {
  const jwt = exp => `header.${Buffer.from(JSON.stringify({ exp })).toString('base64url')}.signature`;
  assert.equal(shouldRefreshJwtToken(jwt(Math.floor(Date.now() / 1000) + 900)), false);
  assert.equal(shouldRefreshJwtToken(jwt(Math.floor(Date.now() / 1000) + 5)), true);
  assert.equal(getJwtExpiration('invalid'), null);
  const nonfinite = `header.${Buffer.from('{"exp":1e309}').toString('base64url')}.signature`;
  assert.equal(getJwtExpiration(nonfinite), null);
});
test('shared schemas reject API requests that bypass input limits', () => {
  assert.equal(loginSchema.safeParse({ email: 'student@example.com', password: 'x'.repeat(129) }).success, false);
  assert.equal(registerAccountSchema.safeParse({ email: 'student@example.com', password: 'short', full_name: 'Nguyễn An' }).success, false);
  const registered = registerAccountSchema.parse({ email: ' student@example.com ', password: 'password123', full_name: ' Nguyễn An ', rememberMe: true });
  assert.deepEqual(registered, { email: 'student@example.com', password: 'password123', full_name: 'Nguyễn An' });
});
