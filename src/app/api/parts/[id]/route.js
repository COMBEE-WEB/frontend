import { proxyParts } from '@/lib/parts-proxy';
export async function GET(request, { params }) {
 const { id } = await params;
 if (!/^[1-9]\d*$/.test(id)) return Response.json({ detail: '올바른 부품 번호가 아닙니다.' }, { status: 400 });
 return proxyParts(request, id);
}
