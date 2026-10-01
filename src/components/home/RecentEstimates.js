'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '@/components/ai/Estimate.module.css';
export default function RecentEstimates({ account }) {
 const [state, setState] = useState(null);
 useEffect(() => {
  if (!account) return;
  const controller = new AbortController();
  fetch('/api/estimates', { cache: 'no-store', signal: controller.signal }).then(async response => {
   const data = await response.json();
   if (!response.ok) throw new Error(data.detail);
   setState({ items: data.items });
  }).catch(error => { if (!controller.signal.aborted) setState({ error: error.message }); });
  return () => controller.abort();
 }, [account]);
 if (!account) return <p className={styles.hint}>로그인하면 저장한 견적을 볼 수 있어요.</p>;
 if (!state) return <p role="status" className={styles.hint}>견적 내역을 불러오는 중…</p>;
 if (state.error) return <p role="alert" className={styles.hint}>{state.error}</p>;
 if (!state.items.length) return <p className={styles.hint}>저장된 견적이 없습니다. 첫 AI 견적을 만들어보세요.</p>;
 return <ul className={styles.recent}>{state.items.map(item => <li key={item.id}><Link href={'/ai/estimates/' + item.id}>{item.name}<time>{new Date(item.created_at).toLocaleDateString('ko-KR')}</time></Link></li>)}</ul>;
}
