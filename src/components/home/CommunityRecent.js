'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
export default function CommunityRecent({ board }) {
 const [data, setData] = useState(null), [error, setError] = useState('');
 useEffect(() => {
  const controller = new AbortController();
  fetch('/api/community/posts?board=' + board, { signal: controller.signal, cache: 'no-store' }).then(async response => {
   const result = await response.json();
   if (!response.ok) throw new Error('게시글을 불러오지 못했습니다.');
   setData(result.items.slice(0, 3));
  }).catch(err => { if (err.name !== 'AbortError') setError(err.message); });
  return () => controller.abort();
 }, [board]);
 if (error) return <p style={{fontSize:12,color:'#999'}}>{error}</p>;
 if (!data) return <p style={{fontSize:12,color:'#999'}}>게시글을 불러오는 중…</p>;
 return <div style={{fontSize:12,display:'grid',gap:8}}>{data.length ? data.map(post => <Link key={post.id} href={'/community?board=' + board + '&post=' + post.id} style={{textDecoration:'none',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{post.title}</Link>) : <Link href={'/community?board=' + board} style={{color:'#999'}}>첫 이야기를 남겨보세요.</Link>}</div>;
}
