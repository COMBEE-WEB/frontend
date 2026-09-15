import Link from "next/link";
import { Folder } from "lucide-react";
import styles from "./PartExplainCategory.module.css";

const categories = [
    { id: "cpu", name: "CPU" },
    { id: "gpu", name: "GPU" },
    { id: "memory", name: "메모리" },
    { id: "storage", name: "SSD / HDD" },
    { id: "mainboard", name: "메인보드" },
    { id: "power", name: "파워" },
    { id: "case", name: "PC케이스" },
];

//-------------------
// 부품 종류별 상세 페이지 링크 표시
//-------------------
function CategoryItem({ category })
{
    return (
        <li>
            <Link
                href={`/Parts/partexplaincategory/${category.id}`}
                className={styles.categoryButton}
                aria-label={`${category.name} 설명 보기`}
            >
                <Folder
                    className={styles.folderIcon}
                    fill="currentColor"
                    strokeWidth={0}
                    aria-hidden="true"
                />

                <span className={styles.categoryName}>
                    {category.name}
                </span>
            </Link>
        </li>
    );
}

//-------------------
// 부품 설명 카테고리 목록 표시
//-------------------
export default function PartExplainCategory()
{
    return (
        <ul className={styles.categoryList} aria-label="부품 종류">
            {categories.map(
                (category) =>
                {
                    return (
                        <CategoryItem
                            key={category.id}
                            category={category}
                        />
                    );
                }
            )}
        </ul>
    );
}
