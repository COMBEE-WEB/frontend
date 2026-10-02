import Link from 'next/link';
import { Cpu, CircuitBoard, MemoryStick, HardDrive, Cable, PcCase, PanelsTopLeft, ArrowUpRight, BookOpen } from 'lucide-react';
import { partGuides } from '@/lib/part-guides';
import styles from './PartExplainCategory.module.css';
export const guideIcons = {cpu:Cpu,gpu:PanelsTopLeft,memory:MemoryStick,storage:HardDrive,mainboard:CircuitBoard,power:Cable,case:PcCase};
export default function PartExplainCategory(){
 return <>
  <section className={styles.intro}><BookOpen size={26}/><div><span>HARDWARE GUIDE</span><h2>부품을 알면, 견적이 쉬워져요.</h2><p>무슨 역할을 하는지부터, 구매 전 확인할 규격까지 차근차근 살펴보세요.</p></div></section>
  <div className={styles.listHeading}><h2>부품별 알아보기</h2><span>7개의 기본 가이드</span></div>
  <ul className={styles.categoryList}>{partGuides.map((part,index)=>{const Icon=guideIcons[part.id];return <li key={part.id}><Link href={'/Parts/partexplaincategory/'+part.id} className={styles.categoryButton}>
   <div className={styles.cardTop}><span className={styles.icon}><Icon size={25} strokeWidth={1.5}/></span><span className={styles.number}>0{index+1}</span></div>
   <small>{part.english}</small><h3>{part.name}<ArrowUpRight size={16}/></h3><p>{part.role}</p><div className={styles.tags}>{part.tags.map(tag=><span key={tag}>{tag}</span>)}</div>
  </Link></li>})}</ul>
 </>;
}
