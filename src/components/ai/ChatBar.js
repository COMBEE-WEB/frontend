"use client";

import { useState } from "react";
import { Plus, ArrowUp } from "lucide-react";
import styles from "./ChatBar.module.css";

export default function ChatBar({ onSend }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    if (onSend) {
      onSend(trimmedMessage);
    }

    console.log("전송한 메시지:", trimmedMessage);
    setMessage("");
  };

  return (
    <form className={styles.chatBar} onSubmit={handleSubmit}>
      <button
        className={styles.addButton}
        type="button"
        aria-label="파일 추가"
      >
        <Plus size={19} />
      </button>

      <input
        className={styles.input}
        type="text"
        placeholder="BEE에게 견적 물어보기"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />

      <button
        className={styles.sendButton}
        type="submit"
        disabled={!message.trim()}
        aria-label="메시지 전송"
      >
        <ArrowUp size={17} />
      </button>
    </form>
  );
}