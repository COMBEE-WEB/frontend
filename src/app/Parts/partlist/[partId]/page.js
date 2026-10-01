import Link from 'next/link';
import { notFound } from 'next/navigation';
import PartListView from '@/components/parts/PartListView';
import { getPartCategory } from '@/lib/parts';
import styles from '@/components/parts/PartListDetail.module.css';
export default async function PartListDetailPage({ params, searchParams }) {
 const { partId } = await params;
 const part = getPartCategory(partId);
 if (!part) notFound();
 const search = await searchParams;
 const query = typeof search.q === 'string' ? search.q.slice(0, 100) : '';
 return <main className={styles.page}>
  <header className={styles.header}><h1 className={styles.title}>{part.name} 부품 리스트</h1>
   <p className={styles.description}>제품명과 제조사로 부품을 찾아보세요.</p></header>
  <nav className={styles.breadcrumb} aria-label="현재 위치"><Link href="/Parts/partlist">부품 리스트</Link><span> &gt; {part.name}</span></nav>
  <PartListView key={part.id + ':' + query} category={part.id} initialQuery={query} />
 </main>;
}
