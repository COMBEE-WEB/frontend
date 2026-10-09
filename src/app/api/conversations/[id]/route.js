import { estimatesProxy } from '@/lib/estimates-proxy';
export async function GET(request, {params}) { return estimatesProxy(request, (await params).id, 'conversations'); }
export async function POST(request, {params}) { return estimatesProxy(request, (await params).id, 'conversations'); }
export async function DELETE(request, {params}) { return estimatesProxy(request, (await params).id, 'conversations'); }
