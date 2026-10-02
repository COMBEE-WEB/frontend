import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Lightbulb, Link2 } from 'lucide-react';
import { partGuides } from '@/lib/part-guides';
import { guideIcons } from './PartExplainCategory';
import styles from './PartExplainContents.module.css';
export default function PartExplainContents({partId}){
 const part=partGuides.find(p=>p.id===partId);if(!part)notFound();const Icon=guideIcons[part.id];
 return <main className={styles.page}>
  <nav className={styles.breadcrumb}><Link href="/Parts/partexplaincategory"><ArrowLeft size={13}/>부품 설명</Link><span>/</span><span>{part.name}</span></nav>
  <div className={styles.layout}><article className={styles.content}>
   <header className={styles.hero}><span className={styles.icon}><Icon size={34} strokeWidth={1.4}/></span><div><small>{part.english}</small><h1>{part.name}</h1><p>{part.role}</p></div></header>
   <section className={styles.role}><span className={styles.kicker}>01 · 역할 이해하기</span><h2>어떤 일을 하나요?</h2><p>{part.description}</p></section>
   <section className={styles.checks}><span className={styles.kicker}>02 · 선택 기준</span><h2>이 세 가지부터 살펴보세요</h2>{part.checks.map(([title,body],i)=><div className={styles.check} key={title}><span>0{i+1}</span><div><h3>{title}</h3><p>{body}</p></div></div>)}</section>
   <section className={styles.compatibility}><h2><Link2 size={16}/>함께 확인할 부품</h2><p>{part.pair}</p></section>
   <aside className={styles.tip}><Lightbulb size={18}/><div><strong>알아두면 좋아요</strong><p>{part.tip}</p></div></aside>
   <Link className={styles.cta} href={'/Parts/partlist/'+(part.category||part.id)}>실제 {part.name} 제품 비교하기<ArrowRight size={16}/></Link>
  </article><aside className={styles.side}><h2>다른 부품 알아보기</h2>{partGuides.map(p=><Link key={p.id} href={'/Parts/partexplaincategory/'+p.id} aria-current={p.id===partId?'page':undefined}>{p.name}{p.id===partId?<Check size={13}/>:<ArrowRight size={13}/>}</Link>)}<p>각 부품의 역할을 익힌 뒤<br/>나만의 견적을 시작해보세요.</p><Link className={styles.start} href="/ai/question">맞춤 견적 시작하기 ↗</Link></aside></div>
 </main>;
}
