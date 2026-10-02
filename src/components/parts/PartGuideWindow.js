"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BookOpen, X, ArrowRight, Lightbulb } from 'lucide-react';
import { partGuides } from '@/lib/part-guides';
import { guideIcons } from './PartExplainCategory';
import styles from './PartGuideWindow.module.css';
export default function PartGuideWindow(){
 const dialog=useRef(null), opener=useRef(null), reading=useRef(null);
 const [selected,setSelected]=useState('cpu');
 const part=partGuides.find(item=>item.id===selected), Icon=guideIcons[selected];
 useEffect(()=>{const element=dialog.current;element.showModal();return ()=>element.close();},[]);
 function close(){dialog.current.close();opener.current?.focus();}
 function select(id){setSelected(id);reading.current?.scrollTo({top:0});}
 return <>
  <section className={styles.launch}><BookOpen size={30}/><h2>내 PC의 부품, 하나씩 알아보세요.</h2><p>한 창에서 부품을 바꿔가며 역할과 선택 기준을 확인할 수 있어요.</p><button ref={opener} onClick={()=>dialog.current.showModal()}>부품 설명 열기<ArrowRight size={15}/></button></section>
  <dialog ref={dialog} className={styles.window} aria-labelledby="guide-window-title" onCancel={e=>{e.preventDefault();close();}}>
   <header className={styles.toolbar}><BookOpen size={16}/><h2 id="guide-window-title">부품 가이드</h2><span>알고 고르는 나만의 PC</span><button onClick={close} aria-label="부품 설명 닫기"><X size={19}/></button></header>
   <div className={styles.workspace}>
    <nav className={styles.menu} aria-label="설명할 부품 선택">{partGuides.map(item=>{const ItemIcon=guideIcons[item.id];return <button key={item.id} onClick={()=>select(item.id)} aria-pressed={selected===item.id}><ItemIcon size={18}/><span>{item.name}</span></button>})}</nav>
    <article className={styles.reading} ref={reading} aria-label={part.name+' 설명'}>
     <header className={styles.hero}><div className={styles.icon}><Icon size={30}/></div><div><small>{part.english}</small><h3>{part.name}</h3><p>{part.role}</p></div></header>
     <p className={styles.description}>{part.description}</p>
     <h4 className={styles.sectionTitle}>구매 전, 이 세 가지부터</h4>
     <div className={styles.checks}>{part.checks.map(([title,body],i)=><section key={title}><span>0{i+1}</span><div><h4>{title}</h4><p>{body}</p></div></section>)}</div>
     <section className={styles.pair}><h4>함께 확인할 부품</h4><p>{part.pair}</p></section>
     <div className={styles.tip}><Lightbulb size={16}/><p>{part.tip}</p></div>
    </article>
   </div>
   <footer className={styles.footer}><span>{part.name} 가이드</span><Link href={'/Parts/partlist/'+(part.category||part.id)}>제품 비교하기<ArrowRight size={14}/></Link></footer>
  </dialog>
 </>;
}
