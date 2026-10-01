import { estimatesProxy } from '@/lib/estimates-proxy';
export async function GET(request, { params }) { return estimatesProxy(request, (await params).id); }
