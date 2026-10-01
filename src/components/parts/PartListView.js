'use client';
import { useEffect, useState } from 'react';
import { fetchParts, formatPrice } from '@/lib/parts';
import PartDetailModal from './PartDetailModal';
import styles from './PartListDetail.module.css';
const PAGE_SIZE = 20;
export default function PartListView({ category, initialQuery = '' }) {
 const [query, setQuery] = useState(initialQuery);
 const [manufacturer, setManufacturer] = useState('');
 const [filter, setFilter] = useState({ q: initialQuery, manufacturer: '', offset: 0, retry: 0 });
 const [result, setResult] = useState(null);
 const [selectedId, setSelectedId] = useState(null);
 const key = JSON.stringify([category, filter]);
 const current = result?.key === key ? result : null;
 useEffect(() => {
  const controller = new AbortController();
  const params = new URLSearchParams({ category, q: filter.q, manufacturer: filter.manufacturer, limit: PAGE_SIZE, offset: filter.offset });
  fetchParts('?' + params, controller.signal).then((data) => setResult({ key, data }))
   .catch((error) => { if (!controller.signal.aborted) setResult({ key, error: error.message }); });
  return () => controller.abort();
 }, [category, filter, key]);
 function search(event) {
  event.preventDefault();
  setFilter({ q: query.trim(), manufacturer: manufacturer.trim(), offset: 0, retry: filter.retry + 1 });
 }
 return <>
  <section className={styles.productSection} aria-labelledby="product-list-title">
   <h2 id="product-list-title" className={styles.sectionTitle}>제품 목록</h2>
   <form className={styles.searchForm} onSubmit={search}>
    <label>제품명<input className={styles.searchInput} type="search" maxLength={100} placeholder="예: Ryzen, GeForce"
     value={query} onChange={(e) => setQuery(e.target.value)} /></label>
    <label>제조사<input className={styles.searchInput} type="search" maxLength={100} placeholder="전체 / 예: AMD, ASUS"
     value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} /></label>
    <button className={styles.actionButton} type="submit">검색</button>
    <button className={styles.actionButton} type="button" onClick={() => {
     setQuery(''); setManufacturer(''); setFilter({ q: '', manufacturer: '', offset: 0, retry: filter.retry + 1 });
    }}>초기화</button>
   </form>
   {!current && <p role="status" className={styles.empty}>부품을 불러오는 중입니다…</p>}
   {current?.error && <div role="alert" className={styles.empty}><p>{current.error}</p>
    <button className={styles.actionButton} onClick={() => setFilter({ ...filter, retry: filter.retry + 1 })}>다시 시도</button></div>}
   {current?.data && <>
    <div className={styles.tableWrapper}><table className={styles.productTable}>
     <thead><tr><th>부품 이름</th><th>제조사</th><th>출시 연도</th><th>가격</th></tr></thead>
     <tbody>{current.data.items.map((product) => <tr key={product.id}>
      <td><button className={styles.productLink} onClick={() => setSelectedId(product.id)}>{product.name}</button></td>
      <td>{product.manufacturer === 'Unknown' ? '정보 없음' : product.manufacturer}</td>
      <td>{product.specs?.metadata?.releaseYear || '정보 없음'}</td><td>{formatPrice(product.lowest_price)}</td>
     </tr>)}</tbody>
    </table></div>
    {!current.data.items.length && <p className={styles.empty}>검색 조건에 맞는 제품이 없습니다.</p>}
    <nav className={styles.pagination} aria-label="제품 목록 페이지">
     <button className={styles.actionButton} disabled={filter.offset === 0} onClick={() => setFilter({ ...filter, offset: filter.offset - PAGE_SIZE })}>이전</button>
     <span aria-live="polite">{filter.offset / PAGE_SIZE + 1} 페이지</span>
     <button className={styles.actionButton} disabled={!current.data.has_more} onClick={() => setFilter({ ...filter, offset: filter.offset + PAGE_SIZE })}>다음</button>
    </nav>
   </>}
   <p className={styles.attribution}>데이터: <a href="https://github.com/buildcores/buildcores-open-db" target="_blank" rel="noreferrer">BuildCores OpenDB</a>
    {' · '}<a href="https://opendatacommons.org/licenses/by/1-0/" target="_blank" rel="noreferrer">ODC-By 1.0</a></p>
  </section>
  {selectedId !== null && <PartDetailModal key={selectedId} productId={selectedId} onClose={() => setSelectedId(null)} />}
 </>;
}
