import test from 'node:test';
import assert from 'node:assert/strict';
import { sameOrigin } from '../src/lib/server-origin.mjs';
const request = (origin, host = 'internal:3000') => new Request('http://internal:3000/api/auth/login', {
 headers: { ...(origin ? { origin } : {}), host, 'x-forwarded-host': 'combee.example.com' },
});
test('configured HTTPS origin works behind an HTTP reverse proxy', () => {
 assert.equal(sameOrigin(request('https://combee.example.com'), 'https://combee.example.com'), true);
});
test('foreign and missing origins remain rejected', () => {
 for (const origin of ['https://evil.example.com', 'http://combee.example.com', 'null', undefined]) {
  assert.equal(sameOrigin(request(origin), 'https://combee.example.com'), false);
 }
});
test('development fallback still matches protocol and host', () => {
 assert.equal(sameOrigin(request('http://internal:3000'), ''), true);
 assert.equal(sameOrigin(request('https://internal:3000'), ''), false);
 assert.equal(sameOrigin(request('http://evil:3000'), ''), false);
});
test('invalid deployment origin fails closed', () => {
 assert.equal(sameOrigin(request('https://combee.example.com'), 'not a url'), false);
});
