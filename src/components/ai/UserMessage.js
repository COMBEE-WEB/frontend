import styles from "./Message.module.css";

export default function UserMessage({ message }) {
  return (
    <div className={styles.userRow}>
      <div className={styles.userMessage}>
        {message}
      </div>
    </div>
  );
}