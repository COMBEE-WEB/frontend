'use client';
import Link from 'next/link';
import { useState } from 'react';
import Sidebar from '@/components/common/Sidebar';
import WorkspaceBar from '@/components/common/WorkspaceBar';
import RecentEstimates from './RecentEstimates';
import CommunityRecent from './CommunityRecent';
import OnboardingFlow from '@/components/ai/OnboardingFlow';
import styles from './Dashboard.module.css';

export default function HomeDashboard() {
 const [account, setAccount] = useState(null);
 const name = account?.member?.full_name || account?.profile?.nickname;
 return <div className={styles.shell}>
  <Sidebar onAccount={setAccount} />
  <main className={styles.main}>
   <WorkspaceBar section="워크스페이스" title="홈"/>
   <header className={styles.header}>
    <h1>{name ? name + '님 반갑습니다' : 'COMBEE에 오신 걸 환영합니다'}</h1>
    <p>공지사항, 최근 견적, 커뮤니티 소식을 한눈에 보세요!</p>
   </header>
   <section className={styles.quickStart}>
    <div><h2>나에게 딱 맞는 PC, 함께 찾아볼까요?</h2><p>예산과 용도를 알려주면 BEEBEE가 구성을 도와드려요.</p></div>
    <Link href="/ai/question">견적 시작하기 <span aria-hidden="true">↗</span></Link>
   </section>
   <section className={styles.notice} aria-label="공지사항">
    현재 등록된 공지사항이 없습니다.
   </section>
   <div className={styles.boards}>
    <section className={styles.card} aria-labelledby="general-title">
     <h2 id="general-title">자유게시판 최근 글</h2>
     <CommunityRecent board="free"/>
    </section>
    <section className={styles.card} aria-labelledby="build-title">
     <h2 id="build-title">견적공유게시판 최근 글</h2>
     <CommunityRecent board="build_share"/>
    </section>
   </div>
   <section className={styles.recent} aria-labelledby="recent-title">
    <div className={styles.cardHeading}><h2 id="recent-title">최근 만든 견적리스트</h2>
     <Link href="/ai/question">견적 시작하기 →</Link></div>
    <RecentEstimates account={account}/>
   </section>
  </main>
  {account && <OnboardingFlow gate/>}
 </div>;
}
