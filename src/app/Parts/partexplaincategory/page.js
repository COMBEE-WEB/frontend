import PartExplainCategory from "@/components/parts/PartExplainCategory";
import styles from "@/components/parts/PartExplainCategory.module.css";

//-------------------
// 부품 설명 페이지 표시
//-------------------
export default function PartExplainPage()
{
    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>부품설명</h1>
                <p className={styles.description}>
                    컴퓨터의 모든 부품에 대해서 알아보아요!
                </p>
            </header>

            <p className={styles.breadcrumb}>
                HOME &gt; 부품설명
            </p>

            <PartExplainCategory />
        </main>
    );
}
