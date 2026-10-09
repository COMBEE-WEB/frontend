import { sameOrigin } from './server-origin.mjs';
import { cookies } from 'next/headers';

const backend = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' };
const reply = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });

export async function estimatesProxy(request, id = '', resource = 'estimates') {
 if (id && !['chat', 'onboarding', 'onboarding/preferences'].includes(id) && !/^[1-9]\d*(\/favorite)?$/.test(id)) return reply({ detail: '견적 번호가 올바르지 않습니다.' }, 400);
 if (['POST', 'DELETE'].includes(request.method) && !sameOrigin(request)) return reply({ detail: 'Invalid request origin.' }, 403);
 let body;
 if (request.method === 'POST') {
  const raw = await request.text();
  if (raw.length > 60000) return reply({ detail: '입력 내용이 너무 깁니다.' }, 413);
  try { body = JSON.parse(raw); } catch { return reply({ detail: '입력 형식이 올바르지 않습니다.' }, 400); }
 }
 const jar = await cookies();
 let token = jar.get('combee_access')?.value;
 async function call() {
  return fetch(backend + '/api/' + resource + (id ? '/' + id : '') + (request.method === 'GET' && !id ? new URL(request.url).search : ''), {
   method: request.method, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
   body: body ? JSON.stringify(body) : undefined, cache: 'no-store', signal: AbortSignal.timeout(170000),
  });
 }
 try {
  let response = token ? await call() : null;
  if (!response || response.status === 401) {
   const refresh = jar.get('combee_refresh')?.value;
   if (!refresh) return reply({ detail: '로그인 후 이용해주세요.' }, 401);
   const renewed = await fetch(backend + '/api/auth/refresh', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refresh }), cache: 'no-store', signal: AbortSignal.timeout(15000) });
   if (!renewed.ok) return reply({ detail: '로그인이 만료됐습니다. 다시 로그인해주세요.' }, 401);
   const { session } = await renewed.json();
   token = session.access_token;
   jar.set('combee_access', token, { ...cookieOptions, maxAge: session.expires_in || 3600 });
   jar.set('combee_refresh', session.refresh_token, { ...cookieOptions, maxAge: 2592000 });
   response = await call();
  }
  return reply(await response.json(), response.status);
 } catch {
  return reply({ detail: '견적 서버 응답을 받지 못했습니다. 잠시 후 내 견적 목록을 확인해주세요.' }, 502);
 }
}
