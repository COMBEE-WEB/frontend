import styles from "./AiQuestion.module.css";

export default function UserAnswer({
  options,
  selectedAnswer,
  onSelect,
}) {
  return (
    <div className={styles.answerList}>
      {options.map((option) => (
        <button
          key={option}
          className={`${styles.answerButton} ${
            selectedAnswer === option
              ? styles.selected
              : ""
          }`}
          type="button"
          onClick={() => onSelect(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}