"use client";

import { useState } from "react";
import ChatBar from "./ChatBar";
import UserMessage from "./UserMessage";
import AiMessage from "./AiMessage";
import styles from "./ChatLog.module.css";

export default function ChatLog() {
  const [messages, setMessages] = useState([]);

  const handleSend = (message) => {
    const userMessage = {
      id: Date.now(),
      sender: "user",
      message: message,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    // 테스트용 AI 응답
    setTimeout(() => {
      const aiMessage = {
        id: Date.now(),
        sender: "ai",
        message:
          "좋아요! 원하시는 예산과 주로 사용하는 용도를 알려주세요.",
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        aiMessage,
      ]);
    }, 700);
  };

  return (
    <main className={styles.chatContainer}>
      {messages.length === 0 ? (
        <section className={styles.startScreen}>
          <h1>오늘은 어떤 견적을 맞춰볼까요?</h1>

          <ChatBar onSend={handleSend} />
        </section>
      ) : (
        <>
          <section className={styles.messageArea}>
            <div className={styles.messageList}>
              {messages.map((item) =>
                item.sender === "user" ? (
                  <UserMessage
                    key={item.id}
                    message={item.message}
                  />
                ) : (
                  <AiMessage
                    key={item.id}
                    message={item.message}
                  />
                ),
              )}
            </div>
          </section>

          <section className={styles.bottomBar}>
            <ChatBar onSend={handleSend} />
          </section>
        </>
      )}
    </main>
  );
}