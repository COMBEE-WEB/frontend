import PartGuideWindow from "@/components/parts/PartGuideWindow";
import styles from "@/components/parts/PartExplainCategory.module.css";

//-------------------
// 부품 설명 페이지 표시
//-------------------
export default function PartExplainPage()
{
    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>부품 설명</h1>
                <p className={styles.description}>
                    내 PC를 구성하는 부품, 쉽게 이해하고 비교해보세요.
                </p>
            </header>

            <PartGuideWindow />
        </main>
    );
}
