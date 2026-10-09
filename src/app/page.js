import HomeDashboard from '@/components/home/HomeDashboard';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
 const jar = await cookies();
 if (!jar.get('combee_access')?.value && !jar.get('combee_refresh')?.value) redirect('/auth');
 return <HomeDashboard />;
}
