"use client";

import { useState } from "react";
import UserAnswer from "./UserAnswer";
import styles from "./AiQuestion.module.css";

const budgetOptions = [
  "50~100만원",
  "100~150만원",
  "150~200만원",
  "250만원~300만원",
  "그 이상",
];

export default function AiQuestion() {
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const handleSelect = (answer) => {
    setSelectedAnswer(answer);

    console.log("선택한 예상 비용:", answer);

    // 나중에 다음 질문으로 넘어가는 코드 추가
  };

  return (
    <div className={styles.overlay}>
      <section className={styles.questionModal}>
        <div className={styles.content}>
          <span className={styles.category}>
            견적질문
          </span>

          <h1>생각하는 예상비용은 어느정도인가요?</h1>

          <UserAnswer
            options={budgetOptions}
            selectedAnswer={selectedAnswer}
            onSelect={handleSelect}
          />
        </div>
      </section>
    </div>
  );
}