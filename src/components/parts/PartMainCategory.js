import Link from "next/link";
import { Folder } from "lucide-react";
import styles from "./PartMainCategory.module.css";
import { partCategories } from "@/lib/parts";


//-------------------
// 부품 종류별 목록 페이지 링크 표시
//-------------------
function CategoryItem({ category })
{
    return (
        <li>
            <Link
                href={`/Parts/partlist/${category.id}`}
                className={styles.categoryButton}
                aria-label={`${category.name} 목록 보기`}
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
// 부품의 주요 카테고리 목록 표시
//-------------------
export default function PartMainCategory()
{
    return (
        <ul className={styles.categoryList} aria-label="부품 종류">
            {partCategories.map(
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
