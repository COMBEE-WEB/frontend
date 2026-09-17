import Sidebar from "@/components/common/Sidebar";
import HomeDashboard from "@/components/home/HomeDashboard";
import styles from "./page.module.css";

//-------------------
// 홈 대시보드 페이지 표시
//-------------------
export default function HomePage()
{
    return (
        <div className={styles.layout}>
            <Sidebar />
            <HomeDashboard />
        </div>
    );
}
