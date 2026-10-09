import { estimatesProxy } from '@/lib/estimates-proxy';
export async function GET(request) { return estimatesProxy(request, '', 'conversations'); }
export async function POST(request) { return estimatesProxy(request, '', 'conversations'); }
