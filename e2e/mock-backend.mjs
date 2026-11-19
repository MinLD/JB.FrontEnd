import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
let state;
const reset = () => { state = { access: new Set(), refresh: new Set(), refreshes: 0, logouts: 0, status: 200, lastHeaders: null }; };
reset();
const user = { id: 'user-1', email: 'student@example.com', full_name: 'Nguyễn An', created_at: '2026-01-01T00:00:00Z' };
const jwt = seconds => `header.${Buffer.from(JSON.stringify({ exp: Math.floor(Date.now()/1000) + seconds, jti: randomUUID() })).toString('base64url')}.signature`;
function pair() { const tokens = { access_token: jwt(900), refresh_token: jwt(86400), expires_in: 900 }; state.access.add(tokens.access_token); state.refresh.add(tokens.refresh_token); return tokens; }
const server = createServer(async (req, res) => {
  let raw = ''; for await (const chunk of req) raw += chunk;
  let body = {}; try { body = JSON.parse(raw || '{}'); } catch {}
  const path = new URL(req.url, 'http://localhost').pathname;
  const send = (data, status = 200) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ code: status < 400 ? 'SUCCESS' : 'ERROR', message: status < 400 ? 'OK' : 'Không thể xác thực.', data })); };
  if (path === '/__reset') { reset(); return send(null); }
  if (path === '/__stats') return send({ refreshes: state.refreshes, logouts: state.logouts, lastHeaders: state.lastHeaders });
  if (path === '/__expire') { state.access.clear(); return send(null); }
  if (path === '/__revoke') { state.access.clear(); state.refresh.clear(); return send(null); }
  if (path === '/__status') { state.status = body.status; return send(null); }
  if (state.status !== 200) return send(null, state.status);
  if (path === '/api/auth/login') return body.password === 'password123' ? send(pair()) : send(null, 401);
  if (path === '/api/auth/register') return send({ ...user, ...body }, 201);
  if (path === '/api/auth/refresh') {
    if (!state.refresh.delete(body.refresh_token)) return send(null, 401);
    state.refreshes++; return send(pair());
  }
  if (path === '/api/auth/logout') { state.refresh.delete(body.refresh_token); state.logouts++; return send(null); }
  state.lastHeaders = { authorization: req.headers.authorization, cookie: req.headers.cookie ?? null };
  if (!state.access.has(req.headers.authorization?.replace('Bearer ', ''))) return send(null, 401);
  if (path === '/api/profile/malformed') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end('42'); }
  if (path === '/api/auth/me' || path === '/api/profile/me') return send(user);
  send(null, 404);
});
server.listen(4319, '127.0.0.1');
