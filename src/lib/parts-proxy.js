export async function proxyParts(request, id) {
 const base = (process.env.BACKEND_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
 const url = new URL(base + '/api/parts' + (id ? '/' + id : ''));
 if (!id) {
  const input = new URL(request.url).searchParams;
  for (const key of ['category', 'q', 'manufacturer', 'limit', 'offset']) {
   if (input.has(key)) url.searchParams.set(key, input.get(key));
  }
 }
 try {
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(15000) });
  return Response.json(await response.json(), { status: response.status });
 } catch {
  return Response.json({ detail: '부품 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.' }, { status: 502 });
 }
}
