'use client';
import Link from 'next/link';
import { useState } from 'react';
import Sidebar from '@/components/common/Sidebar';
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
   <header className={styles.header}>
    <h1>{name ? name + '님 반갑습니다' : 'COMBEE에 오신 걸 환영합니다'}</h1>
    <p>공지사항, 최근 견적, 커뮤니티 소식을 한눈에 보세요!</p>
   </header>
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
