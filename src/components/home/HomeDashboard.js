import Link from "next/link";
import { Bell, Bot, ChevronRight, Clock3, MessageCircle, Sparkles } from "lucide-react";
import styles from "./HomeDashboard.module.css";

const freeCommunityPosts = [
    { id: 1, title: "오늘 하루 어떠셨나요?", comments: 10 },
    { id: 2, title: "요즘 할 만한 게임 추천해주세요", comments: 8 },
    { id: 3, title: "새 컴퓨터 맞추고 첫 글 남깁니다", comments: 6 },
];

const estimateCommunityPosts = [
    { id: 1, title: "게임용 컴퓨터 견적 확인 부탁드려요!", comments: 12 },
    { id: 2, title: "이 구성으로 영상 편집 가능할까요?", comments: 9 },
    { id: 3, title: "150만 원대 견적 조언 부탁드립니다", comments: 7 },
];

const recentEstimates = [
    { id: 1, date: "2026-09-17", title: "게임과 과제용 균형 견적", price: "1,480,000원" },
    { id: 2, date: "2026-09-16", title: "FHD 게이밍 중심 견적", price: "1,210,000원" },
];

//-------------------
// 인기 게시글 목록 표시
//-------------------
function PopularPostList({ posts, href })
{
    return (
        <ul className={styles.popularList}>
            {posts.map(
                (post, index) =>
                {
                    return (
                        <li key={post.id}>
                            <Link href={href} className={styles.popularLink}>
                                <span className={styles.rank}>{index + 1}</span>
                                <span className={styles.postTitle}>{post.title}</span>
                                <span className={styles.commentCount}>
                                    <MessageCircle size={14} aria-hidden="true" />
                                    {post.comments}
                                </span>
                            </Link>
                        </li>
                    );
                }
            )}
        </ul>
    );
}

//-------------------
// 홈 대시보드 콘텐츠 표시
//-------------------
export default function HomeDashboard()
{
    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <p className={styles.eyebrow}>WELCOME BACK</p>
                    <h1>송민창님 반갑습니다</h1>
                    <p>공지사항, 최근 견적, 커뮤니티 인기글을 한눈에 보세요!</p>
                </header>

                <Link href="/community" className={styles.notice}>
                    <span className={styles.noticeIcon}>
                        <Bell size={18} aria-hidden="true" />
                    </span>
                    <span>
                        <strong>새로운 공지사항이 올라왔어요!</strong>
                        <small>COMBEE 서비스 업데이트 내용을 확인해보세요.</small>
                    </span>
                    <ChevronRight size={18} aria-hidden="true" />
                </Link>

                <section className={styles.communityGrid} aria-label="커뮤니티 인기글">
                    <article className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div><span className={styles.cardIcon}><MessageCircle size={18} aria-hidden="true" /></span><h2>자유게시판 오늘의 인기글</h2></div>
                            <Link href="/community/free">전체보기</Link>
                        </div>
                        <PopularPostList posts={freeCommunityPosts} href="/community/free" />
                    </article>

                    <article className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div><span className={styles.cardIcon}><Sparkles size={18} aria-hidden="true" /></span><h2>견적공유게시판 오늘의 인기글</h2></div>
                            <Link href="/community">전체보기</Link>
                        </div>
                        <PopularPostList posts={estimateCommunityPosts} href="/community" />
                    </article>
                </section>

                <section className={`${styles.card} ${styles.estimateCard}`} aria-labelledby="recent-estimate-title">
                    <div className={styles.cardHeader}>
                        <div><span className={styles.cardIcon}><Clock3 size={18} aria-hidden="true" /></span><h2 id="recent-estimate-title">최근에 짠 견적리스트</h2></div>
                        <Link href="/ai/chat">AI 견적 만들기</Link>
                    </div>
                    <ul className={styles.estimateList}>
                        {recentEstimates.map(
                            (estimate) =>
                            {
                                return (
                                    <li key={estimate.id}>
                                        <Link href="/ai/chat">
                                            <span className={styles.estimateIcon}><Bot size={18} aria-hidden="true" /></span>
                                            <span className={styles.estimateInfo}><time>{estimate.date}</time><strong>{estimate.title}</strong></span>
                                            <span className={styles.price}>{estimate.price}</span>
                                            <ChevronRight size={18} aria-hidden="true" />
                                        </Link>
                                    </li>
                                );
                            }
                        )}
                    </ul>
                </section>
            </div>
        </main>
    );
}
