import { sameOrigin } from '@/lib/server-origin.mjs';
import { cookies } from 'next/headers';
const backend = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
const reply = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
async function proxy(request, context) {
 const { path } = await context.params;
 const route = path.join('/');
 if (!/^(posts(\/[1-9]\d*(\/(comments|edit|delete))?)?|comments\/[1-9]\d*\/(edit|delete))$/.test(route)) return reply({ detail: '잘못된 주소입니다.' }, 404);
 const write = request.method === 'POST';
 let body;
 if (write) {
  try {
   if (!sameOrigin(request)) return reply({ detail: 'Invalid request origin.' }, 403);
   const raw = await request.text();
   if (raw.length > 12000) return reply({ detail: '내용이 너무 깁니다.' }, 413);
   body = raw ? JSON.parse(raw) : {};
  } catch { return reply({ detail: '요청 형식이 올바르지 않습니다.' }, 400); }
 }
 const jar = await cookies();
 let token = jar.get('combee_access')?.value;
 const query = new URLSearchParams();
 for (const key of ['board', 'offset', 'q']) { const value = new URL(request.url).searchParams.get(key); if (value !== null) query.set(key, value); }
 const call = () => fetch(backend + '/api/community/' + route + '?' + query, {
  method: request.method, headers: { 'Content-Type': 'application/json', ...(write && token ? { Authorization: 'Bearer ' + token } : {}) },
  body: write ? JSON.stringify(body) : undefined, cache: 'no-store', signal: AbortSignal.timeout(20000),
 });
 try {
  let response = !write || token ? await call() : null;
  if (write && (!response || response.status === 401)) {
   const refresh = jar.get('combee_refresh')?.value;
   if (!refresh) return reply({ detail: '로그인 후 작성해주세요.' }, 401);
   const renewed = await fetch(backend + '/api/auth/refresh', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: refresh }), cache: 'no-store', signal: AbortSignal.timeout(15000) });
   if (!renewed.ok) return reply({ detail: '다시 로그인해주세요.' }, 401);
   const { session } = await renewed.json(); token = session.access_token;
   const options = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' };
   jar.set('combee_access', token, { ...options, maxAge: session.expires_in || 3600 });
   jar.set('combee_refresh', session.refresh_token, { ...options, maxAge: 2592000 });
   response = await call();
  }
  return reply(await response.json(), response.status);
 } catch { return reply({ detail: '서버 응답을 확인하지 못했습니다. 작성 중이었다면 목록에서 등록 여부를 먼저 확인해주세요.' }, 502); }
}
export async function GET(request, context) { return proxy(request, context); }
export async function POST(request, context) { return proxy(request, context); }
