import Link from "next/link";
import styles from "./CommunityNavigation.module.css";

// 커뮤니티 게시판 이동 메뉴 표시
export default function CommunityNavigation({ activeBoard })
{
    return (
        <nav className={styles.navigation} aria-label="커뮤니티 게시판 선택">
            <Link
                href="/community"
                className={activeBoard === "estimate" ? styles.active : styles.link}
            >
                견적 공유
            </Link>
            <Link
                href="/community/free"
                className={activeBoard === "free" ? styles.active : styles.link}
            >
                자유 게시판
            </Link>
        </nav>
    );
}
