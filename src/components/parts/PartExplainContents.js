import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./PartExplainContents.module.css";

const partDescriptions = {
    cpu: {
        name: "CPU",
        description: "컴퓨터의 연산과 명령 처리를 담당하는 핵심 부품입니다.",
    },
    gpu: {
        name: "GPU",
        description: "그래픽과 영상 데이터를 빠르게 처리하는 부품입니다.",
    },
    memory: {
        name: "메모리",
        description: "실행 중인 프로그램의 데이터를 임시로 저장하는 부품입니다.",
    },
    storage: {
        name: "SSD / HDD",
        description: "운영체제와 프로그램, 사용자 파일을 보관하는 저장 장치입니다.",
    },
    mainboard: {
        name: "메인보드",
        description: "각 컴퓨터 부품을 연결하고 통신할 수 있게 하는 기판입니다.",
    },
    power: {
        name: "파워",
        description: "컴퓨터의 각 부품에 필요한 전력을 공급하는 장치입니다.",
    },
    case: {
        name: "PC케이스",
        description: "컴퓨터 부품을 보호하고 냉각을 돕는 외부 구조물입니다.",
    },
};

//-------------------
// 선택한 부품의 설명 표시
//-------------------
export default function PartExplainContents({ partId })
{
    const part = partDescriptions[partId];

    if (!part)
    {
        notFound();
    }

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>부품설명</h1>
                <p className={styles.description}>
                    컴퓨터의 모든 부품에 대해서 알아보아요!
                </p>
            </header>

            <nav className={styles.breadcrumb} aria-label="현재 위치">
                <Link href="/Parts/partexplaincategory">HOME</Link>
                <span aria-hidden="true"> &gt; </span>
                <span>{part.name}</span>
            </nav>

            <section className={styles.content}>
                <h2 className={styles.partName}>{part.name}</h2>
                <p className={styles.partDescription}>{part.description}</p>
            </section>
        </main>
    );
}
