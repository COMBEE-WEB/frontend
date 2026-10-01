import { notFound } from 'next/navigation';
import SavedEstimate from '@/components/ai/SavedEstimate';
export default async function Page({ params }) {
 const { id } = await params;
 if (!/^[1-9]\d*$/.test(id)) notFound();
 return <SavedEstimate key={id} id={id}/>;
}
