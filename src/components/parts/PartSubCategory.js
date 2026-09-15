import Link from "next/link";
import { Folder } from "lucide-react";
import styles from "./PartSubCategory.module.css";

//-------------------
// 부품 제조사 선택 화면 표시
//-------------------
export default function PartSubCategory({ partId, categories })
{
    return (
        <ul className={styles.categoryList}>
            {categories
                .filter(
                    (category) =>
                    {
                        return category !== "전체";
                    }
                )
                .map(
                    (category) =>
                    {
                        return (
                            <li key={category}>
                                <Link
                                    href={`/Parts/partlist/${partId}/${category.toLowerCase()}`}
                                    className={styles.categoryLink}
                                >
                                    <Folder
                                        className={styles.folderIcon}
                                        fill="currentColor"
                                        strokeWidth={0}
                                    />
                                    <span>{category}</span>
                                </Link>
                            </li>
                        );
                    }
                )}
        </ul>
    );
}