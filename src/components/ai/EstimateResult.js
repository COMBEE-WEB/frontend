'use client';
import { useState } from 'react';
import { getPartCategory, formatPrice } from '@/lib/parts';
import PartDetailModal from '@/components/parts/PartDetailModal';
import PartReplacement from './PartReplacement';
import styles from './Estimate.module.css';

export default function EstimateResult({ result: initialResult }) {
 const [result, setResult] = useState(initialResult);
 const [replaceCategory, setReplaceCategory] = useState(null);
 const [partId, setPartId] = useState(null);
 return <section className={styles.result} aria-label="AI 추천 구성">
  <p className={styles.badge}>AI 추천 초안 · 구매 전 확인 필요</p>
  <h2>{result.request.purpose}용 PC 추천 구성</h2><p>{result.summary}</p>
  <div className={styles.totals}><div>목표 예산<strong>{formatPrice(result.request.budget_won)}</strong></div>
   <div>등록 가격 합계<strong>{result.total_price == null ? '가격 확인 필요' : formatPrice(result.total_price)}</strong></div></div>
  <p>{result.saved ? '내 계정에 비공개 저장됐습니다.' : '저장되지 않은 결과입니다.'}</p>
  {result.budget_status === 'over' && <p role="alert">등록된 가격 합계가 목표 예산을 초과합니다.</p>}
  {result.compatibility_status === 'conflict' && <p role="alert">부품 간 사양 충돌이 발견됐습니다. 이 구성대로 구매하지 말고 조건을 수정해주세요.</p>}
  <div className={styles.parts}>{result.parts.map(part => <article key={part.id}>
   <div className={styles.partHeading}><span>{getPartCategory(part.category)?.name || part.category}</span>{result.saved && result.id && <button className={styles.replaceButton} onClick={() => setReplaceCategory(part.category)}>부품 변경</button>}</div>
   <button onClick={() => setPartId(part.id)}>{part.name}</button><p>{part.reason}</p>
   <small>{formatPrice(part.lowest_price)} · {part.quantity}개{part.category === 'memory' ? ' 키트' : ''}</small>
  </article>)}</div>
  {!!result.missing_categories.length && <p>선정하지 못했거나 생략한 부품: {result.missing_categories.map(c => getPartCategory(c)?.name || c).join(', ')}</p>}
  {result.saved && result.id && result.missing_categories.map(category => <button key={category} className={styles.replaceButton} onClick={() => setReplaceCategory(category)}>{getPartCategory(category)?.name || category} 추가</button>)}
  {replaceCategory && <PartReplacement key={replaceCategory} buildId={result.id} category={replaceCategory} onClose={() => setReplaceCategory(null)} onSaved={updated => { setResult(updated); setReplaceCategory(null); }} />}
  <h3>서버 사양 비교</h3><ul>{result.checks.map(check => <li key={check.label}>{check.label}: <strong>{({pass:'등록 사양 일치',conflict:'충돌',unknown:'확인 필요'})[check.status]}</strong></li>)}</ul>
  <h3>구매 전 확인</h3><ul>{result.warnings.map((warning,i) => <li key={i}>{warning}</li>)}</ul>
  <p className={styles.source}>부품 데이터: <a href="https://github.com/buildcores/buildcores-open-db">BuildCores OpenDB</a> · <a href="https://opendatacommons.org/licenses/by/1-0/">ODC-By 1.0</a></p>
  {partId && <PartDetailModal key={partId} productId={partId} onClose={() => setPartId(null)}/>}
 </section>;
}
