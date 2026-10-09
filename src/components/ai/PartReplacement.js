"use client";
import { useEffect, useRef, useState } from 'react';
import { getPartCategory, formatPrice } from '@/lib/parts';
import styles from './Estimate.module.css';

export default function PartReplacement({ buildId, category, onClose, onSaved }) {
 const dialog = useRef(null);
 const [query, setQuery] = useState('');
 const [search, setSearch] = useState('');
 const [revision, setRevision] = useState(0);
 const [page, setPage] = useState(0);
 const [data, setData] = useState(null);
 const [error, setError] = useState('');
 const [saving, setSaving] = useState(null);
 useEffect(() => { dialog.current.showModal(); }, []);
 useEffect(() => {
  const controller = new AbortController();
  fetch('/api/parts?' + new URLSearchParams({ category, q: search, limit: '20', offset: String(page * 20) }), { signal: controller.signal, cache: 'no-store' })
   .then(async response => { const body = await response.json(); if (!response.ok) throw new Error(body.detail || '부품을 불러오지 못했습니다.'); return body; })
   .then(setData).catch(error => { if (!controller.signal.aborted) setError(error.message); });
  return () => controller.abort();
 }, [category, search, page, revision]);
 async function select(part) {
  if (saving !== null) return;
  setSaving(part.id); setError('');
  try {
   const response = await fetch('/api/estimates/' + buildId, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ category, part_id: part.id }) });
   const updated = await response.json();
   if (!response.ok) throw new Error(updated.detail || '부품을 변경하지 못했습니다.');
   onSaved(updated);
  } catch (error) { setError(error.message); }
  finally { setSaving(null); }
 }
 function close() { if (saving === null) onClose(); }
 return <dialog ref={dialog} className={styles.replacementDialog} onCancel={event => { event.preventDefault(); close(); }} aria-labelledby="replace-title">
  <div className={styles.replacementHeader}><h2 id="replace-title">{getPartCategory(category)?.name || category} 바꾸기</h2><button type="button" onClick={close} disabled={saving !== null} aria-label="부품 변경 닫기">✕</button></div>
  <p className={styles.hint}>선택한 부품으로 견적을 변경하고 저장합니다. 가격 합계와 기본 호환성을 다시 확인해요.</p>
  <form className={styles.replacementSearch} onSubmit={event => { event.preventDefault(); setData(null); setError(''); setPage(0); setSearch(query); setRevision(value => value + 1); }}>
   <input aria-label="교체할 부품 검색" placeholder="제품명으로 검색" value={query} onChange={event => setQuery(event.target.value)} maxLength={100} disabled={saving !== null}/><button disabled={saving !== null}>검색</button>
  </form>
  {error && <p role="alert" className={styles.error}>{error}</p>}
  {!data && !error && <p role="status">부품을 불러오는 중…</p>}
  {data && <><ul className={styles.replacementList}>{data.items.map(part => <li key={part.id}><div><strong>{part.name}</strong><small>{formatPrice(part.lowest_price)}</small></div><button disabled={saving !== null} onClick={() => select(part)}>{saving === part.id ? '저장 중…' : '이 부품 선택'}</button></li>)}</ul>
   {!data.items.length && <p>검색된 부품이 없습니다.</p>}
   <div className={styles.actions}><button disabled={page === 0 || saving !== null} onClick={() => { setData(null); setPage(page - 1); }}>이전</button><span>{page + 1} 페이지</span><button disabled={!data.has_more || saving !== null} onClick={() => { setData(null); setPage(page + 1); }}>다음</button></div>
  </>}
 </dialog>;
}
