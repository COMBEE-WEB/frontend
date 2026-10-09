"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './Estimate.module.css';
export default function ConversationHistory() {
 const [items, setItems] = useState(null);
 const [error, setError] = useState('');
 const [hasMore, setHasMore] = useState(false);
 const [onlyFavorites, setOnlyFavorites] = useState(false);
 const [busy, setBusy] = useState(null);
 const [confirmId, setConfirmId] = useState(null);
 useEffect(() => {
  const controller = new AbortController();
  fetch('/api/conversations', { cache: 'no-store', signal: controller.signal }).then(async response => {
   const data = await response.json(); if (!response.ok) throw new Error(data.detail || '대화 기록을 불러오지 못했습니다.');
   setItems(data.items); setHasMore(data.has_more);
  }).catch(error => { if (!controller.signal.aborted) setError(error.message); });
  return () => controller.abort();
 }, []);
 async function mutate(item, remove = false) {
  if (busy !== null) return;
  setBusy(item.id); setError('');
  try {
   const response = await fetch('/api/conversations/' + item.id, { method: remove ? 'DELETE' : 'POST', headers: { 'Content-Type': 'application/json' }, body: remove ? undefined : JSON.stringify({ favorite: !item.favorite }) });
   const data = await response.json(); if (!response.ok) throw new Error(data.detail || '대화 기록을 변경하지 못했습니다.');
   setItems(previous => remove ? previous.filter(row => row.id !== item.id) : previous.map(row => row.id === item.id ? { ...row, favorite: data.favorite } : row));
   if (remove) setConfirmId(null);
  } catch (error) { setError(error.message); }
  finally { setBusy(null); }
 }
 async function more() {
  setBusy('more'); setError('');
  try {
   const response = await fetch('/api/conversations?offset=' + items.length, { cache: 'no-store' });
   const data = await response.json(); if (!response.ok) throw new Error(data.detail || '대화를 불러오지 못했습니다.');
   setItems(previous => [...previous, ...data.items]); setHasMore(data.has_more);
  } catch (error) { setError(error.message); }
  finally { setBusy(null); }
 }
 const visible = items?.filter(item => !onlyFavorites || item.favorite);
 return <div>
  <label className={styles.favoriteFilter}><input type="checkbox" checked={onlyFavorites} onChange={event => setOnlyFavorites(event.target.checked)}/> 즐겨찾기만 보기</label>
  {error && <p role="alert" className={styles.error}>{error}</p>}
  {!items && !error && <p role="status">대화 기록을 불러오는 중…</p>}
  {visible && !visible.length && <p className={styles.hint}>{onlyFavorites ? '즐겨찾기한 대화가 없습니다.' : '저장된 대화가 없습니다. AI와 대화하면 자동으로 저장됩니다.'}</p>}
  <ul className={styles.recent}>{visible?.map(item => <li key={item.id}>
   <div className={styles.savedRow}><button className={styles.favoriteButton} aria-label={item.favorite ? '대화 즐겨찾기 해제' : '대화 즐겨찾기'} aria-pressed={item.favorite} disabled={busy !== null} onClick={() => mutate(item)}>{item.favorite ? '★' : '☆'}</button>
    <Link href={'/ai/chat?conversation=' + item.id}>{item.title}<time>{new Date(item.created_at).toLocaleDateString('ko-KR')}</time></Link>
    <button className={styles.deleteButton} disabled={busy !== null} onClick={() => setConfirmId(item.id)}>삭제</button>
   </div>
   {confirmId === item.id && <div className={styles.deleteConfirm}><p>이 대화 기록을 삭제할까요? 삭제한 기록은 다시 볼 수 없습니다.</p><button disabled={busy !== null} onClick={() => mutate(item, true)}>삭제 확인</button><button disabled={busy !== null} onClick={() => setConfirmId(null)}>취소</button></div>}
  </li>)}</ul>
  {hasMore && <button className={styles.moreButton} disabled={busy !== null} onClick={more}>대화 더 보기</button>}
 </div>;
}
