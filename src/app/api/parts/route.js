import { proxyParts } from '@/lib/parts-proxy';
export async function GET(request) { return proxyParts(request); }
