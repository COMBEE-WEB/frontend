import { notFound, redirect } from 'next/navigation';
import { getPartCategory } from '@/lib/parts';
export default async function CompanyPartListPage({ params }) {
 const { partId } = await params;
 const part = getPartCategory(partId);
 if (!part) notFound();
 redirect('/Parts/partlist/' + part.id);
}
