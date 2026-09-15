import Link from "next/link";
import PartListView from "@/components/parts/PartListView";
import styles from "@/components/parts/PartListDetail.module.css";

const partNames = {
    cpu: "CPU",
    gpu: "GPU",
    memory: "메모리",
    storage: "SSD / HDD",
    mainboard: "메인보드",
    power: "파워",
    case: "PC케이스",
};

// 제조사별 부품 목록 페이지 표시
export default async function CompanyPartListPage({ params })
{
    const { partId, company } = await params;
    const partName = partNames[partId] ?? partId.toUpperCase();
    const companyName = company.toUpperCase();

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>부품리스트</h1>
                <p className={styles.description}>
                    컴퓨터의 모든 부품에 대해서 사용자와 소통해보세요!
                </p>
            </header>

            <nav className={styles.breadcrumb} aria-label="현재 위치">
                <Link href="/Parts/partlist">HOME</Link>
                <span> &gt; </span>

                <Link href={`/Parts/partlist/${partId}`}>
                    {partName}
                </Link>

                <span> &gt; {companyName}</span>
            </nav>

            <PartListView
                partName={partName}
                activeCategory={company}
            />
        </main>
    );
}