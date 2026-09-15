"use client";

import { useState } from "react";
import styles from "./FindId.module.css";

export default function FindId() {
  const [userData, setUserData] = useState({
    email: "",
    phone: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setUserData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("이메일:", userData.email);
    console.log("전화번호:", userData.phone);

    // 나중에 백엔드 아이디 찾기 API 연결
  };

  return (
    <main className={styles.container}>
      <div className={styles.logo}>⬡</div>

      <form className={styles.findBox} onSubmit={handleSubmit}>
        <div className={styles.titleArea}>
          <h1>아이디찾기</h1>
          <p>아이디를 찾기 위해 이메일과 전화번호를 입력해주세요</p>
        </div>

        <div className={styles.formArea}>
          <div className={styles.inputBox}>
            <span className={styles.icon}>✉</span>

            <input
              name="email"
              type="email"
              placeholder="이메일을 입력해주세요"
              value={userData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputBox}>
            <span className={styles.icon}>🔒</span>

            <input
              name="phone"
              type="tel"
              placeholder="전화번호를 입력해주세요"
              value={userData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <button className={styles.findButton} type="submit">
            아이디찾기
          </button>
        </div>
      </form>
    </main>
  );
}