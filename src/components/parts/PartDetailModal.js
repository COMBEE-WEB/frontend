'use client';
import { Fragment, useEffect, useRef, useState } from 'react';
import { fetchParts, formatPrice, getPartCategory } from '@/lib/parts';
import { Cpu, X, ExternalLink, ListFilter, MessageCircle, PanelRightOpen } from 'lucide-react';
import PartComments from './PartComments';
import styles from './PartDetailModal.module.css';

const labels = { color: '색상', interface: '인터페이스', memory_bus: '메모리 버스', memory_type: '메모리 종류', video_outputs: '영상 출력', core_base_clock: '기본 코어 클럭', core_boost_clock: '부스트 코어 클럭', power_connectors: '전원 커넥터', total_slot_width: '슬롯 두께', chipset_manufacturer: '칩셋 제조사', effective_memory_clock: '유효 메모리 클럭',  dimensions: '크기', length: '길이', width: '너비', height: '높이', cooling: '냉각', connectivity: '연결', ports: '포트', power: '전력', display: '디스플레이', physical: '외형', features: '기능', storage: '저장장치', compatibility: '호환성', gpu: '그래픽', cpu: '프로세서', vram: '비디오 메모리', clockSpeed: '클럭 속도', boostClock: '부스트 클럭', memoryType: '메모리 종류', memorySize: '메모리 용량',  socket: '소켓', cores: '코어', threads: '스레드', total: '전체', performance: '성능 코어',
 efficiency: '효율 코어', clocks: '클럭', base: '기본', boost: '부스트', cache: '캐시',
 specifications: '사양', integratedGraphics: '내장 그래픽', memory: '메모리', capacity: '용량',
 speed: '속도', type: '종류', tdp: 'TDP', wattage: '출력', formFactor: '폼 팩터', chipset: '칩셋',
 series: '시리즈', microarchitecture: '마이크로아키텍처', coreFamily: '코어 계열' };
function labelFor(key) { return labels[key] || key.replace(/([a-z])([A-Z])/g, '$1 $2').replaceAll('_', ' '); }
function specs(value, path = '', raw = '') {
 if (value == null || value === '') return [];
 if (Array.isArray(value) && value.every(item => item == null || typeof item !== 'object')) return [[path, value.filter(item => item != null && item !== '').join(', '), raw]];
 if (typeof value !== 'object') return [[path, typeof value === 'boolean' ? (value ? '지원' : '미지원') : String(value), raw]];
 return Object.entries(value).flatMap(([key, child]) => specs(child, path ? path + ' / ' + labelFor(key) : labelFor(key), raw ? raw + '.' + key : key));
}
const priorities = {
 cpu: [/socket|cores|threads|integrated.?graphics/i, /tdp|clock|cache|memory/i],
 gpu: [/chipset$|^memory$|vram|memory.?size|length|tdp|power.?connector/i, /clock|memory.?type|memory.?bus|video.?output|slot|interface|cooling/i],
 motherboard: [/socket|form.?factor|chipset|memory.?type/i, /memory|pcie|m.?2|sata|usb|wifi|ethernet|network|power/i],
 memory: [/capacity|size|memory.?type|^type$|speed|modules/i, /latency|voltage|timing|ecc|profile|height/i],
 storage: [/capacity|size|^type$|interface|form.?factor/i, /read|write|cache|endurance|tbw|nand|pcie/i],
 power_supply: [/watt|output|efficiency|form.?factor/i, /connector|modular|length|fan|atx|protection/i],
 case: [/form.?factor|motherboard|gpu|cooler|dimensions/i, /fan|radiator|drive|usb|expansion/i],
 cpu_cooler: [/socket|height|radiator|type/i, /fan|noise|rpm|tdp|dimensions/i],
 monitor: [/size|resolution|refresh|panel/i, /response|brightness|hdr|sync|port|displayport|hdmi/i],
};
function priority(category, key) {
 const rules = priorities[category] || [/capacity|size|type|interface|connection|compatib|resolution/i, /power|dimensions|weight|speed|port|wireless|battery/i];
 return rules[0].test(key) ? 1 : rules[1].test(key) ? 2 : 3;
}
export default function PartDetailModal({ productId, onClose }) {
 const dialog = useRef(null);
 const [result, setResult] = useState(null);
 const [commentsOpen, setCommentsOpen] = useState(false);
 const commentToggle = useRef(null);
 function collapseComments() { setCommentsOpen(false); commentToggle.current?.focus(); }
 const [highlight, setHighlight] = useState(true);
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
 const entries = Object.entries(product?.specs || {}).filter(([key]) => !['metadata', 'identifiers', 'opendb_id', 'general_product_information'].includes(key));
 const simple = entries.filter(([, value]) => value == null || typeof value !== 'object' || Array.isArray(value));
 const nested = entries.filter(([, value]) => value && typeof value === 'object' && !Array.isArray(value));
 const groups = [{ title: '기본 사양', rows: simple.flatMap(([key, value]) => specs(value, labelFor(key), key)) }, ...nested.map(([key, value]) => ({ title: labelFor(key), rows: specs(value, '', key) }))].filter(group => group.rows.length);


 return <dialog ref={dialog} className={`${styles.detailDialog} ${commentsOpen ? styles.withComments : ''}`} aria-labelledby="part-detail-title"
  onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => {
   if (event.target === dialog.current) {
    const rect = dialog.current.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
   }
  }}>
  <header className={styles.toolbar}><span><Cpu size={16}/>부품 상세 정보</span>{product && <button type="button" className={styles.panelToggle} aria-pressed={highlight} onClick={() => setHighlight(value => !value)} title="초급자가 먼저 볼 사양 강조 켜기·끄기">초급자 강조</button>}{product && <button ref={commentToggle} type="button" className={styles.panelToggle} aria-expanded={commentsOpen} aria-controls="part-comment-panel" onClick={() => setCommentsOpen(value => !value)}><MessageCircle size={15}/><span>한마디</span><PanelRightOpen size={16}/></button>}<button type="button" className={styles.closeButton} onClick={onClose} aria-label="상세 창 닫기"><X size={19}/></button></header>
  <div className={styles.detailBody}>
  <div className={styles.content}>
  {!product && <h2 id="part-detail-title">부품 정보 확인</h2>}
  {!current && <div className={styles.state} role="status">상세 정보를 불러오는 중입니다…</div>}
  {current?.error && <div className={styles.state} role="alert"><p>{current.error}</p><button className={styles.actionButton} onClick={() => setRetry(retry + 1)}>다시 시도</button></div>}
  {product && <>
   <section className={styles.overview}>
    <div className={styles.badges}><span>{getPartCategory(product.category)?.name || product.category}</span><span>{product.manufacturer === 'Unknown' ? '제조사 정보 없음' : product.manufacturer}</span></div>
    <h2 id="part-detail-title">{product.name}</h2>
    <div className={styles.summary}><div><small>등록 가격</small><strong>{formatPrice(product.lowest_price)}</strong></div><div><small>출시 연도</small><strong>{product.specs?.metadata?.releaseYear || '정보 없음'}</strong></div></div>
    {product.description && <p className={styles.description}>{product.description}</p>}
   </section>
   <div className={styles.sectionHeading}><h3><ListFilter size={16}/>상세 사양</h3><span>원본 데이터 기준</span></div>
   <div className={styles.groups}>{groups.map(group => <section className={styles.specGroup} key={group.title}><h4>{group.title}</h4><dl>{group.rows.map(([label, value, key]) => <Fragment key={key}><dt className={highlight && priority(product.category, key) === 1 ? styles.highlightLabel : undefined}>{label || group.title}</dt><dd className={highlight && priority(product.category, key) === 1 ? styles.highlightValue : undefined}>{value}</dd></Fragment>)}</dl></section>)}</div>
   {!groups.length && <p className={styles.state}>등록된 상세 사양이 없습니다.</p>}
  </>}
  </div>
  {product && <aside id="part-comment-panel" className={styles.commentPanel} hidden={!commentsOpen} aria-label="부품 한마디"><PartComments key={product.id} productId={product.id} onCollapse={collapseComments}/></aside>}
  </div>
  <footer className={styles.footer}><span>데이터 · BuildCores OpenDB</span>{product?.source_url?.startsWith('https://github.com/buildcores/buildcores-open-db/') && <a href={product.source_url} target="_blank" rel="noreferrer">원본 정보<ExternalLink size={12}/></a>}<button className={styles.actionButton} onClick={onClose}>닫기</button></footer>
 </dialog>;
}
