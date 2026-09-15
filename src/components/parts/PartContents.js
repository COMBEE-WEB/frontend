import PartMainCategory from "./PartMainCategory";
import styles from "./PartMainCategory.module.css";

//-------------------
// 부품 리스트 화면 표시
//-------------------
export default function PartContents()
{
    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>부품 리스트</h1>
                <p className={styles.description}>
                    컴퓨터의 모든 부품에 대해서 다른 유저와 소통해보세요!
                </p>
            </header>
            <p className={styles.breadcrumb}>
                HOME &gt;
            </p>
            <PartMainCategory />
        </main>
    );
}
