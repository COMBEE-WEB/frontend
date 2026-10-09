"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '@/components/ai/Estimate.module.css';

async function readList(offset, signal) {
 const response = await fetch('/api/estimates?offset=' + offset, { cache: 'no-store', signal });
 const data = await response.json();
 if (!response.ok) throw new Error(data.detail || '견적 목록을 불러오지 못했습니다.');
 return data;
}

export default function RecentEstimates({ account }) {
 const [onlyFavorites, setOnlyFavorites] = useState(false);
 const [state, setState] = useState(null);
 const [busy, setBusy] = useState(null);
 const [error, setError] = useState('');
 const [confirmId, setConfirmId] = useState(null);
 useEffect(() => {
  if (!account) return;
  const controller = new AbortController();
  readList(0, controller.signal).then(setState).catch(error => {
   if (!controller.signal.aborted) setState({ error: error.message });
  });
  return () => controller.abort();
 }, [account]);

 async function favorite(item) {
  if (busy !== null) return;
  setBusy(item.id); setError('');
  try {
   const response = await fetch('/api/estimates/' + item.id + '/favorite', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ favorite: !item.favorite }) });
   const data = await response.json();
   if (!response.ok) throw new Error(data.detail || '즐겨찾기를 변경하지 못했습니다.');
   setState(previous => ({ ...previous, items: previous.items.map(row => row.id === item.id ? { ...row, favorite: data.favorite } : row) }));
  } catch (error) { setError(error.message); }
  finally { setBusy(null); }
 }
 async function loadMore() {
  if (busy !== null) return;
  setBusy('more'); setError('');
  try {
   const next = await readList(state.items.length);
   setState(previous => ({ ...next, items: [...previous.items, ...next.items] }));
  } catch (error) { setError(error.message); }
  finally { setBusy(null); }
 }
 async function remove(id) {
  if (busy !== null) return;
  setBusy(id); setError('');
  try {
   const response = await fetch('/api/estimates/' + id, { method: 'DELETE' });
   const data = await response.json();
   if (!response.ok) throw new Error(data.detail || '견적을 삭제하지 못했습니다.');
   setState(previous => ({ ...previous, items: previous.items.filter(item => item.id !== id) }));
   setConfirmId(null);
  } catch (error) { setError(error.message); }
  finally { setBusy(null); }
 }
 if (!account) return <p className={styles.hint}>로그인하면 저장한 견적을 볼 수 있어요.</p>;
 if (!state) return <p role="status" className={styles.hint}>견적 내역을 불러오는 중…</p>;
 if (state.error) return <p role="alert" className={styles.hint}>{state.error}</p>;
 return <div>
  <label className={styles.favoriteFilter}><input type="checkbox" checked={onlyFavorites} onChange={event => setOnlyFavorites(event.target.checked)}/> 즐겨찾기만 보기</label>
  {error && <p role="alert" className={styles.error}>{error}</p>}
  {!state.items.length && <p className={styles.hint}>저장된 견적이 없습니다. 첫 AI 견적을 만들어보세요.</p>}
  <ul className={styles.recent}>{state.items.filter(item => !onlyFavorites || item.favorite).map(item => <li key={item.id}>
   <div className={styles.savedRow}>
    <button className={styles.favoriteButton} aria-label={item.favorite ? "견적 즐겨찾기 해제" : "견적 즐겨찾기"} aria-pressed={item.favorite} disabled={busy !== null} onClick={() => favorite(item)}>{item.favorite ? "★" : "☆"}</button>
    <Link href={'/ai/estimates/' + item.id}>{item.name}<time dateTime={item.created_at}>{new Date(item.created_at).toLocaleDateString('ko-KR')}</time></Link>
    <button type="button" className={styles.deleteButton} disabled={busy !== null} onClick={() => setConfirmId(item.id)} aria-label={item.name + ' 삭제'}>삭제</button>
   </div>
   {confirmId === item.id && <div className={styles.deleteConfirm}>
    <p>이 견적을 삭제할까요? 삭제하면 다시 볼 수 없습니다.</p>
    <button type="button" disabled={busy !== null} onClick={() => remove(item.id)}>{busy === item.id ? '삭제 중…' : '삭제 확인'}</button>
    <button type="button" disabled={busy !== null} onClick={() => setConfirmId(null)}>취소</button>
   </div>}
  </li>)}</ul>
  {state.has_more && <button type="button" className={styles.moreButton} onClick={loadMore} disabled={busy !== null}>{busy === 'more' ? '불러오는 중…' : '견적 더 보기'}</button>}
 </div>;
}
