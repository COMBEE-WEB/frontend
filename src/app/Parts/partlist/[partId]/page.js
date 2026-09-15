import Link from "next/link";
import { notFound } from "next/navigation";
import PartSubCategory from "@/components/parts/PartSubCategory";
import styles from "@/components/parts/PartListDetail.module.css";

const partData = {
    cpu: { name: "CPU", filters: ["전체", "Intel", "AMD"] },
    gpu: { name: "GPU", filters: ["전체", "NVIDIA", "AMD"] },
    memory: { name: "메모리", filters: ["전체", "DDR4", "DDR5"] },
    storage: { name: "SSD / HDD", filters: ["전체", "SSD", "HDD"] },
    mainboard: { name: "메인보드", filters: ["전체", "Intel", "AMD"] },
    power: { name: "파워", filters: ["전체", "600W", "800W"] },
    case: { name: "PC케이스", filters: ["전체", "미들타워", "미니타워"] },
};

//-------------------
// 선택한 부품의 목록 페이지 표시
//-------------------
export default async function PartListDetailPage({ params, searchParams })
{
    const { partId } = await params;
    const { category = "전체" } = await searchParams;
    const part = partData[partId];

    if (!part)
    {
        notFound();
    }

    const activeCategory = part.filters.includes(category) ? category : "전체";

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>{part.name} 부품 리스트</h1>
                <p className={styles.description}>원하는 조건을 선택하고 부품을 확인해보세요.</p>
            </header>
            <nav className={styles.breadcrumb} aria-label="현재 위치">
                <Link href="/Parts/partlist">HOME</Link>
                <span> &gt; {part.name}</span>
            </nav>
            <PartSubCategory
                partId={partId}
                categories={part.filters}
                activeCategory={activeCategory}
            />
        </main>
    );
}
