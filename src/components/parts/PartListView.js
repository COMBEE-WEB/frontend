"use client";

import { useState } from "react";
import PartDetailModal from "./PartDetailModal";
import styles from "./PartListDetail.module.css";

const products = [
    {
        id: 1,
        name: "인텔 셀러론 G5905",
        category: "Intel",
        socket: "소켓 1200",
        core: "2코어",
        thread: "4스레드",
        releaseDate: "2020년 08월",
        price: "60,000원",
        clock: "3.5GHz",
        internalGraphics: "인텔 UHD 그래픽스 610",
    },
    {
        id: 2,
        name: "인텔 코어 i3-10100",
        category: "Intel",
        socket: "소켓 1200",
        core: "4코어",
        thread: "8스레드",
        releaseDate: "2020년 05월",
        price: "120,000원",
        clock: "3.6GHz",
        internalGraphics: "인텔 UHD 그래픽스 630",
    },
];

//-------------------
// 회사와 검색어에 맞는 부품 목록 표시
//-------------------
export default function PartListView({ activeCategory })
{
    const [searchText, setSearchText] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);

    const filteredProducts = products.filter(
        (product) =>
        {
            const matchesCompany =
                product.category.toLowerCase() === activeCategory.toLowerCase();

            const matchesSearch = product.name
                .toLowerCase()
                .includes(searchText.toLowerCase());

            return matchesCompany && matchesSearch;
        }
    );

    return (
        <>
            <section
                className={styles.productSection}
                aria-labelledby="product-list-title"
            >
                <h2 id="product-list-title" className={styles.sectionTitle}>
                    제품 목록
                </h2>

                <label className={styles.searchBox}>
                    <span className={styles.srOnly}>부품 검색</span>
                    <input
                        type="search"
                        value={searchText}
                        className={styles.searchInput}
                        placeholder="부품검색"
                        onChange={
                            (event) =>
                            {
                                setSearchText(event.target.value);
                            }
                        }
                    />
                </label>

                <div className={styles.tableWrapper}>
                    <table className={styles.productTable}>
                        <thead>
                            <tr>
                                <th>부품 이름</th>
                                <th>소켓</th>
                                <th>코어</th>
                                <th>스레드</th>
                                <th>출시일</th>
                                <th>현 가격</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProducts.map(
                                (product) =>
                                {
                                    return (
                                        <tr
                                            key={product.id}
                                            tabIndex={0}
                                            onClick={
                                                () =>
                                                {
                                                    setSelectedProduct(product);
                                                }
                                            }
                                            onKeyDown={
                                                (event) =>
                                                {
                                                    if (event.key === "Enter" || event.key === " ")
                                                    {
                                                        setSelectedProduct(product);
                                                    }
                                                }
                                            }
                                        >
                                            <td>{product.name}</td>
                                            <td>{product.socket}</td>
                                            <td>{product.core}</td>
                                            <td>{product.thread}</td>
                                            <td>{product.releaseDate}</td>
                                            <td>{product.price}</td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </div>

                {filteredProducts.length === 0 && (
                    <p className={styles.empty}>
                        등록된 제품이 없습니다.
                    </p>
                )}
            </section>

            {selectedProduct && (
                <PartDetailModal
                    product={selectedProduct}
                    onClose={
                        () =>
                        {
                            setSelectedProduct(null);
                        }
                    }
                />
            )}
        </>
    );
}
