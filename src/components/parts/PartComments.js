"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, UserRound, PanelRightClose } from 'lucide-react';
import { authRequest } from '@/lib/auth';
import styles from './PartDetailModal.module.css';
async function request(path, body, signal) {
 const response = await fetch('/api/community/' + path, { method: body === undefined ? 'GET' : 'POST', headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body), cache: 'no-store', signal });
 const data = await response.json();
 if (!response.ok) throw new Error(typeof data.detail === 'string' ? data.detail : '댓글을 불러오지 못했습니다.');
 return data;
}
export default function PartComments({ productId, onCollapse }) {
 const [account, setAccount] = useState(null), [items, setItems] = useState([]), [more, setMore] = useState(false);
 const [text, setText] = useState(''), [error, setError] = useState(''), [loading, setLoading] = useState(true), [pending, setPending] = useState(false);
 const [confirmId, setConfirmId] = useState(null);
 const lock = useRef(false);
 const base = 'parts/' + productId + '/comments';
 async function load(offset = 0) {
  const data = await request(base + '?offset=' + offset);
  setItems(prev => offset ? [...prev, ...data.items] : data.items); setMore(data.has_more);
 }
 useEffect(() => {
  const controller = new AbortController();
  authRequest('me').then(data => { if (!controller.signal.aborted) setAccount(data); }).catch(() => {});
  request(base, undefined, controller.signal).then(data => { setItems(data.items); setMore(data.has_more); }).catch(err => { if (!controller.signal.aborted) setError(err.message); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
  return () => controller.abort();
 }, [base]);
 async function act(kind, id) {
  if (lock.current) return;
  lock.current = true; setPending(true); setError('');
  try {
   await request(kind === 'send' ? base : 'part-comments/' + id + '/delete', kind === 'send' ? { content: text.trim() } : {});
   if (kind === 'send') setText('');
   setConfirmId(null);
   await load();
  } catch (err) { setError(err.message); }
  finally { lock.current = false; setPending(false); }
 }
 async function next() {
  if (lock.current) return;
  lock.current = true; setPending(true); setError('');
  try { await load(items.length); } catch (err) { setError(err.message); } finally { lock.current = false; setPending(false); }
 }
 return <section className={styles.discussion} aria-labelledby="part-comments-title">
  <h3 id="part-comments-title"><MessageCircle size={16}/><span>이 부품에 한마디</span><button type="button" className={styles.panelClose} onClick={onCollapse} aria-label="한마디 패널 접기"><PanelRightClose size={18}/></button></h3>
  <div id="part-comments-content">
  <p>사용 경험이나 사양에 대한 의견을 나눠주세요. 댓글은 누구나 볼 수 있어요.</p>
  {account ? <form onSubmit={e => { e.preventDefault(); act('send'); }}>
   <textarea aria-label="부품에 대한 한마디" placeholder="성능, 소음, 호환성 등 궁금한 점이나 사용 후기를 남겨주세요." maxLength={1500} required value={text} onChange={e => setText(e.target.value)} disabled={pending}/>
   <div className={styles.commentActions}><small>{text.length} / 1,500</small><button className={styles.actionButton} disabled={pending || !text.trim()}>등록</button></div>
  </form> : <Link className={styles.loginPrompt} href="/auth">로그인하고 한마디 남기기 →</Link>}
  {error && <div role="alert" className={styles.commentError}>{error}<button className={styles.actionButton} disabled={pending} onClick={next}>다시 불러오기</button></div>}
  {loading && <p role="status">댓글을 불러오는 중…</p>}
  {!loading && !error && !items.length && <p className={styles.noComments}>아직 댓글이 없어요. 첫 의견을 남겨보세요.</p>}
  {items.map(item => <article className={styles.commentItem} key={item.id}>
   <header><UserRound size={15}/><strong>{item.author?.nickname || 'COMBEE 회원'}</strong><time>{new Date(item.created_at).toLocaleDateString('ko-KR')}</time></header>
   <p>{item.content}</p>
   {account?.user?.id === item.author_id && <div className={styles.commentActions}>{confirmId === item.id ? <><small>댓글을 삭제할까요?</small><button disabled={pending} onClick={() => act('delete', item.id)}>삭제</button><button disabled={pending} onClick={() => setConfirmId(null)}>취소</button></> : <button disabled={pending} onClick={() => setConfirmId(item.id)}>삭제</button>}</div>}
  </article>)}
  {more && <button className={styles.actionButton} disabled={pending} onClick={next}>이전 댓글 더 보기</button>}
  </div>
 </section>;
}
