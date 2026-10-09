`use client`;
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { UserRound, MessageCircle, X, Search, PenLine } from 'lucide-react';
import Sidebar from '@/components/common/Sidebar';
import WorkspaceBar from '@/components/common/WorkspaceBar';
import { getPartCategory, formatPrice } from '@/lib/parts';
import styles from './CommunityBoard.module.css';
export async function communityRequest(path, body, signal) {
 const response = await fetch('/api/community/' + path, { method: body === undefined ? 'GET' : 'POST', headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body), cache: 'no-store', signal });
 const data = await response.json();
 if (!response.ok) throw new Error(typeof data.detail === 'string' ? data.detail : '입력 내용을 확인해주세요.');
 return data;
}
const date = value => new Date(value).toLocaleDateString('ko-KR');
function Author({ name, time }) { return <div className={styles.author}><span className={styles.avatar}><UserRound size={16}/></span><span><strong>{name || 'COMBEE 회원'}</strong>{time && <small>{date(time)}</small>}</span></div>; }
function SharedBuild({ build }) {
 if (!build || !Array.isArray(build.parts)) return null;
 return <section className={styles.build}><h3>첨부한 견적</h3>{build.parts.map((part, i) => <div key={i}><span>{getPartCategory(part.category)?.name || part.category}</span><strong>{part.name}</strong><small>{formatPrice(part.lowest_price)} · {part.quantity || 1}개</small></div>)}<p>합계: <b>{build.total_price == null ? '가격 확인 필요' : formatPrice(build.total_price)}</b></p><small>공유 시점의 구성입니다. 구매 전 가격·호환성을 확인해주세요.</small></section>;
}
function PostDialog({ id, account, onClose, onChange }) {
 const dialog = useRef(null), lock = useRef(false);
 const [post, setPost] = useState(null), [comments, setComments] = useState([]), [more, setMore] = useState(false);
 const [comment, setComment] = useState(''), [error, setError] = useState(''), [pending, setPending] = useState(false);
 const [editing, setEditing] = useState(false), [title, setTitle] = useState(''), [content, setContent] = useState('');
 const [editComment, setEditComment] = useState(null), [editText, setEditText] = useState('');
 useEffect(() => {
  dialog.current?.showModal();
  const controller = new AbortController();
  Promise.all([communityRequest('posts/' + id, undefined, controller.signal), communityRequest('posts/' + id + '/comments', undefined, controller.signal)]).then(([p, c]) => { setPost(p); setComments(c.items); setMore(c.has_more); }).catch(err => { if (err.name !== 'AbortError') setError(err.message); });
  return () => controller.abort();
 }, [id]);
 async function mutate(path, body, after) {
  if (lock.current) return;
  lock.current = true; setPending(true); setError('');
  try { await communityRequest(path, body); await after(); onChange(); }
  catch (err) { setError(err.message); }
  finally { lock.current = false; setPending(false); }
 }
 async function reloadComments() { const data = await communityRequest('posts/' + id + '/comments'); setComments(data.items); setMore(data.has_more); }
 const owner = post && account?.user?.id === post.author_id;
 return <dialog ref={dialog} className={styles.dialog} aria-label="게시글 상세" onCancel={e => { if (pending) e.preventDefault(); else onClose(); }}>
  <div className={styles.dialogBar}><span>커뮤니티 · 게시글</span><button className={styles.close} aria-label="닫기" disabled={pending} onClick={onClose}><X size={20}/></button></div>
  {!post ? <p className={styles.empty}>{error || '게시글을 불러오는 중…'}</p> : <>
   <section className={styles.detail}>
    <Author name={post.author?.nickname} time={post.created_at}/>
    {editing ? <form onSubmit={e => { e.preventDefault(); mutate('posts/' + id + '/edit', { title, content }, async () => { setPost(await communityRequest('posts/' + id)); setEditing(false); }); }}>
     <input aria-label="수정할 제목" required maxLength={200} value={title} onChange={e => setTitle(e.target.value)}/>
     <textarea aria-label="수정할 내용" required maxLength={5000} value={content} onChange={e => setContent(e.target.value)}/>
     <div className={styles.actions}><button type="button" onClick={() => setEditing(false)} disabled={pending}>취소</button><button className={styles.primary} disabled={pending}>수정 저장</button></div>
    </form> : <><h2>{post.title}</h2><p className={styles.bodyText}>{post.content}</p></>}
    <SharedBuild build={post.shared_build}/>
    {owner && !editing && <div className={styles.ownerActions}><button disabled={pending} onClick={() => { setTitle(post.title); setContent(post.content); setEditing(true); }}>수정</button><button disabled={pending} onClick={() => { if (window.confirm('게시글과 댓글이 영구 삭제됩니다. 삭제할까요?')) mutate('posts/' + id + '/delete', {}, async () => onClose()); }}>삭제</button></div>}
   </section>
   <section className={styles.comments}><h3>댓글</h3>
    {account ? <form className={styles.commentForm} onSubmit={e => { e.preventDefault(); mutate('posts/' + id + '/comments', { content: comment }, async () => { setComment(''); await reloadComments(); }); }}><input aria-label="댓글 내용" placeholder="의견을 나눠보세요" required maxLength={1500} value={comment} onChange={e => setComment(e.target.value)} disabled={pending}/><button disabled={pending || !comment.trim()}>등록</button></form> : <p><Link href="/auth">로그인하고 댓글 남기기</Link></p>}
    {comments.length === 0 && <p className={styles.muted}>첫 댓글을 남겨보세요.</p>}
    {comments.map(item => <article key={item.id} className={styles.comment}><Author name={item.author?.nickname} time={item.created_at}/>{editComment === item.id ? <form onSubmit={e => { e.preventDefault(); mutate('comments/' + item.id + '/edit', { content: editText }, async () => { setEditComment(null); await reloadComments(); }); }}><input aria-label="수정할 댓글" required maxLength={1500} value={editText} onChange={e => setEditText(e.target.value)}/><button disabled={pending}>저장</button><button type="button" onClick={() => setEditComment(null)}>취소</button></form> : <p>{item.content}</p>}{account?.user?.id === item.author_id && editComment !== item.id && <div className={styles.ownerActions}><button disabled={pending} onClick={() => { setEditComment(item.id); setEditText(item.content); }}>수정</button><button disabled={pending} onClick={() => { if (window.confirm('댓글을 영구 삭제할까요?')) mutate('comments/' + item.id + '/delete', {}, reloadComments); }}>삭제</button></div>}</article>)}
    {more && <button disabled={pending} onClick={async () => { if (lock.current) return; lock.current = true; setPending(true); try { const data = await communityRequest('posts/' + id + '/comments?offset=' + comments.length); setComments(prev => [...prev, ...data.items]); setMore(data.has_more); } catch (err) { setError(err.message); } finally { lock.current = false; setPending(false); } }}>댓글 더 보기</button>}
   </section>
   {error && <p role="alert" className={styles.error}>{error}</p>}
  </>}
 </dialog>;
}
export default function CommunityBoard({ board, initialPost = null }) {
 const share = board === 'build_share';
 const [composing, setComposing] = useState(false);
 const [account, setAccount] = useState(null), [items, setItems] = useState([]), [loading, setLoading] = useState(true), [more, setMore] = useState(false);
 const [page, setPage] = useState(0), [query, setQuery] = useState(''), [search, setSearch] = useState(''), [revision, setRevision] = useState(0);
 const [title, setTitle] = useState(''), [content, setContent] = useState(''), [buildId, setBuildId] = useState(''), [builds, setBuilds] = useState([]), [preview, setPreview] = useState(null);
 const [error, setError] = useState(''), [listError, setListError] = useState(''), [buildError, setBuildError] = useState(''), [pending, setPending] = useState(false), [selected, setSelected] = useState(initialPost);
 const lock = useRef(false);
 useEffect(() => {
  const controller = new AbortController();
  communityRequest('posts?' + new URLSearchParams({ board, offset: String(page * 20), q: query }), undefined, controller.signal).then(data => { setItems(data.items); setMore(data.has_more); setListError(''); }).catch(err => { if (err.name !== 'AbortError') setListError(err.message); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
  return () => controller.abort();
 }, [board, page, query, revision]);
 useEffect(() => {
  if (!share || !account) return;
  const controller = new AbortController();
  fetch('/api/estimates', { signal: controller.signal, cache: 'no-store' }).then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.detail || '견적 목록을 불러오지 못했습니다.'); setBuilds(data.items); }).catch(err => { if (err.name !== 'AbortError') setBuildError(err.message); });
  return () => controller.abort();
 }, [share, account]);
 useEffect(() => {
  if (!buildId) return;
  const controller = new AbortController();
  fetch('/api/estimates/' + buildId, { signal: controller.signal, cache: 'no-store' }).then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.detail || '견적을 불러오지 못했습니다.'); setPreview(data); }).catch(err => { if (err.name !== 'AbortError') setBuildError(err.message); });
  return () => controller.abort();
 }, [buildId]);
 async function publish(e) {
  e.preventDefault();
  if (lock.current) return;
  lock.current = true; setPending(true); setError('');
  try {
   const data = await communityRequest('posts', { board, title, content, build_id: share ? Number(buildId) : null });
   setTitle(''); setContent(''); setBuildId(''); setPreview(null); setPage(0); setQuery(''); setSearch(''); setRevision(n => n + 1); setSelected(data.id); setComposing(false);
  } catch (err) { setError(err.message); } finally { lock.current = false; setPending(false); }
 }
 function refresh() { setRevision(n => n + 1); }
 return <div className={styles.shell}><Sidebar onAccount={setAccount}/><main className={styles.main}>
   <WorkspaceBar section="커뮤니티" title="게시판"/>
  <div className={styles.content}>
  <header className={styles.heading}><div><span className={styles.eyebrow}>COMBEE COMMUNITY</span><h1>{share ? '함께 만드는 더 좋은 견적' : '컴퓨터 이야기, 편하게 나눠요'}</h1><p>{share ? '내 구성을 공유하고, 다른 사람들의 조언을 들어보세요.' : '궁금한 점부터 소소한 일상까지, 여기에 남겨주세요.'}</p></div><button className={styles.primary} aria-expanded={composing} aria-controls="community-compose" onClick={() => setComposing(v => !v)}><PenLine size={16}/>{composing ? '작성 접기' : '글 쓰기'}</button></header>
  <section id="community-compose" className={styles.compose} hidden={!composing}><div className={styles.composeHeader}><Author name={account?.profile?.nickname || 'COMBEE 회원'}/><span>새 이야기 작성</span></div>
   {account ? <form onSubmit={publish}><input aria-label="게시글 제목" placeholder={share ? '내 견적, 어떤가요?' : '이야기의 제목을 적어주세요'} required maxLength={200} value={title} onChange={e => setTitle(e.target.value)} disabled={pending}/><textarea aria-label="게시글 내용" placeholder="나누고 싶은 이야기를 적어주세요." required maxLength={5000} value={content} onChange={e => setContent(e.target.value)} disabled={pending}/>
    {share && <><label className={styles.select}>내 저장 견적<select aria-label="공유할 견적" required value={buildId} disabled={pending} onChange={e => { setBuildId(e.target.value); setPreview(null); setBuildError(''); }}><option value="">견적 선택</option>{builds.map(build => <option key={build.id} value={build.id}>{build.name} · #{build.id}</option>)}</select></label>{!builds.length && <p className={styles.muted}><Link href="/ai/question">견적을 먼저 만들어 저장해주세요.</Link></p>}{buildError && <p role="alert" className={styles.error}>{buildError}</p>}{preview && <details><summary>공개될 부품 목록 미리보기</summary><SharedBuild build={preview}/></details>}<p className={styles.muted}>첨부한 부품 목록과 가격이 공개돼요. 개인 상담 내용은 포함되지 않아요.</p></>}
    <div className={styles.actions}><small>게시글과 댓글은 누구나 볼 수 있어요.</small><button className={styles.primary} disabled={pending || !title.trim() || !content.trim() || (share && !preview)}>{pending ? '등록 중…' : '글쓰기'}</button></div>
   </form> : <p className={styles.muted}><Link href="/auth">로그인하고 이야기를 나눠보세요.</Link></p>}
   {error && <p role="alert" className={styles.error}>{error}</p>}
  </section>
  <div className={styles.listToolbar}><div className={styles.listLabel}><h2>{query ? '검색 결과' : '게시글'}</h2><span>최신순</span></div><form className={styles.search} onSubmit={e => { e.preventDefault(); setPage(0); setLoading(true); setQuery(search); setRevision(n => n + 1); }}><Search size={15}/><input aria-label="게시글 제목 검색" placeholder="제목으로 검색" maxLength={100} value={search} onChange={e => setSearch(e.target.value)}/><button>검색</button></form></div>
  <section className={styles.list} aria-label="게시글 목록">{listError ? <p role="alert" className={styles.empty}>{listError}<button onClick={refresh}>다시 시도</button></p> : loading ? <p className={styles.empty}>게시글을 불러오는 중…</p> : items.length ? items.map(post => <button className={styles.row} key={post.id} onClick={() => setSelected(post.id)}><Author name={post.author?.nickname}/><span className={styles.postTitle}>{post.title} <small aria-label="댓글 수"><MessageCircle size={13}/>{post.comments?.[0]?.count || 0}</small></span><time>{date(post.created_at)}</time></button>) : <p className={styles.empty}>{query ? '검색 결과가 없습니다.' : '아직 게시글이 없어요. 첫 이야기를 남겨보세요!'}</p>}</section>
  <div className={styles.pagination}><button disabled={page === 0} onClick={() => { setLoading(true); setPage(n => n - 1); }}>이전</button><span>{page + 1}</span><button disabled={!more} onClick={() => { setLoading(true); setPage(n => n + 1); }}>다음</button></div>
 </div></main>{selected && <PostDialog key={selected} id={selected} account={account} onClose={() => setSelected(null)} onChange={refresh}/>}</div>;
}
