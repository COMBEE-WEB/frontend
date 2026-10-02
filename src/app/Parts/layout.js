import WorkspaceBar from "@/components/common/WorkspaceBar";
import Sidebar from "@/components/common/Sidebar";
import styles from "./layout.module.css";

// 모든 부품 페이지에 공통 사이드바 표시
export default function PartsLayout({ children })
{
    return (
        <div className={styles.layout}>
            <Sidebar />

            <div className={styles.content}>
                <WorkspaceBar section="하드웨어" title="부품 탐색"/>
                {children}
            </div>
        </div>
    );
}