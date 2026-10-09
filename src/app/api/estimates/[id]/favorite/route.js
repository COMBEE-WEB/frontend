import { estimatesProxy } from '@/lib/estimates-proxy';
export async function POST(request, {params}) { return estimatesProxy(request, (await params).id + '/favorite'); }
