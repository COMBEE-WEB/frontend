import { Bot } from "lucide-react";
import styles from "./Message.module.css";

export default function AiMessage({ message }) {
  return (
    <div className={styles.aiRow}>
      <div className={styles.aiProfile}>
        <Bot size={19} />
      </div>

      <div className={styles.aiContent}>
        <span className={styles.aiName}>BEE</span>
        <div className={styles.aiMessage}>
          {message}
        </div>
      </div>
    </div>
  );
}