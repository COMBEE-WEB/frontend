'use client';
import { Fragment, useEffect, useRef, useState } from 'react';
import { fetchParts, formatPrice } from '@/lib/parts';
import styles from './PartListDetail.module.css';

const labels = { socket: '소켓', cores: '코어', threads: '스레드', total: '전체', performance: '성능 코어',
 efficiency: '효율 코어', clocks: '클럭', base: '기본', boost: '부스트', cache: '캐시',
 specifications: '사양', integratedGraphics: '내장 그래픽', memory: '메모리', capacity: '용량',
 speed: '속도', type: '종류', tdp: 'TDP', wattage: '출력', formFactor: '폼 팩터', chipset: '칩셋',
 series: '시리즈', microarchitecture: '마이크로아키텍처', coreFamily: '코어 계열' };
function specs(value, path = '') {
 if (value == null || value === '') return [];
 if (typeof value !== 'object') return [[path, typeof value === 'boolean' ? (value ? '지원' : '미지원') : String(value)]];
 return Object.entries(value).flatMap(([key, child]) => specs(child, path ? path + ' / ' + (labels[key] || key) : (labels[key] || key)));
}
export default function PartDetailModal({ productId, onClose }) {
 const dialog = useRef(null);
 const [result, setResult] = useState(null);
 const [retry, setRetry] = useState(0);
 useEffect(() => {
  const previous = document.activeElement;
  const element = dialog.current;
  element.showModal();
  return () => { element.close(); previous?.focus(); };
 }, []);
 useEffect(() => {
  const controller = new AbortController();
  fetchParts('/' + productId, controller.signal).then((product) => setResult({ product, retry }))
   .catch((error) => { if (!controller.signal.aborted) setResult({ error: error.message, retry }); });
  return () => controller.abort();
 }, [productId, retry]);
 const current = result?.retry === retry ? result : null;
 const product = current?.product;
 const details = product ? specs(Object.fromEntries(Object.entries(product.specs || {})
  .filter(([key]) => !['metadata', 'identifiers', 'opendb_id', 'general_product_information'].includes(key)))) : [];
 return <dialog ref={dialog} className={styles.detailDialog} aria-labelledby="part-detail-title"
  onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => {
   if (event.target === dialog.current) {
    const rect = dialog.current.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
   }
  }}>
  <button type="button" className={styles.closeButton} onClick={onClose} aria-label="상세 창 닫기">×</button>
  <h2 id="part-detail-title">{product?.name || '부품 상세 정보'}</h2>
  {!current && <p role="status">상세 정보를 불러오는 중입니다…</p>}
  {current?.error && <div role="alert"><p>{current.error}</p><button className={styles.actionButton} onClick={() => setRetry(retry + 1)}>다시 시도</button></div>}
  {product && <>
   <p>{product.manufacturer === 'Unknown' ? '제조사 정보 없음' : product.manufacturer} · {formatPrice(product.lowest_price)}</p>
   {product.description && <p>{product.description}</p>}
   <dl className={styles.specification}>{details.map(([label, value]) => <Fragment key={label}><dt>{label}</dt><dd>{value}</dd></Fragment>)}</dl>
   {!details.length && <p>등록된 상세 사양이 없습니다.</p>}
   {product.source_url?.startsWith('https://github.com/buildcores/buildcores-open-db/') && <p><a href={product.source_url} target="_blank" rel="noreferrer">BuildCores 원본 정보 보기</a></p>}
  </>}
 </dialog>;
}
