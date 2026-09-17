import Sidebar from "@/components/common/Sidebar";
import styles from "./layout.module.css";

// 커뮤니티 페이지에 공통 사이드바 표시
export default function CommunityLayout({ children })
{
    return (
        <div className={styles.layout}>
            <Sidebar />

            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
}
