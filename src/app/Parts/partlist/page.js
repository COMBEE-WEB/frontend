import PartListView from '@/components/parts/PartListView';
import styles from '@/components/parts/PartListDetail.module.css';
export default async function PartListPage({ searchParams }) {
 const params = await searchParams;
 const query = typeof params.q === 'string' ? params.q.slice(0, 100) : '';
 return <main className={styles.page}>
  <header className={styles.header}><h1 className={styles.title}>부품 리스트</h1><p className={styles.description}>모든 부품을 한곳에서 살펴보고, 필요한 조건으로 좁혀보세요.</p></header>
  <PartListView key={query} initialQuery={query}/>
 </main>;
}
