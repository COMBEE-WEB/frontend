'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import EstimateResult from './EstimateResult';
import styles from '@/components/home/HomeDashboard.module.css';
export default function SavedEstimate({ id }) {
 const [result, setResult] = useState(null);
 const [error, setError] = useState('');
 useEffect(() => {
  const controller = new AbortController();
  fetch('/api/estimates/' + id, { signal: controller.signal, cache: 'no-store' }).then(async response => {
   const data = await response.json();
   if (!response.ok) throw new Error(data.detail || '견적을 불러오지 못했습니다.');
   setResult(data);
  }).catch(err => { if (!controller.signal.aborted) setError(err.message); });
  return () => controller.abort();
 }, [id]);
 return <main className={styles.intake}><Link href="/">← COMBEE 홈</Link><div className={styles.buildForm}>
  {error ? <p role="alert">{error} <Link href="/auth">로그인</Link></p> : result ? <EstimateResult result={result}/> : <p role="status">저장된 견적을 불러오는 중…</p>}
  <Link href="/ai/question">새 견적 만들기 →</Link>
 </div></main>;
}
