// The configured public origin avoids proxy-internal HTTP/host mismatches.
// Never infer trusted origins from client-supplied forwarded headers.
export function sameOrigin(request, configured = process.env.APP_ORIGIN) {
 try {
  const source = new URL(request.headers.get('origin'));
  if (configured) {
   const expected = new URL(configured);
   return ['http:', 'https:'].includes(expected.protocol) && source.origin === expected.origin;
  }
  return source.host === request.headers.get('host') && source.protocol === new URL(request.url).protocol;
 } catch { return false; }
}
