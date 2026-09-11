"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Login.module.css";

export default function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setLoginData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(loginData);
  };

  return (
    <main className={styles.container}>
      {/* 나중에 이미지 로고로 변경 가능 */}
      <div className={styles.logo}>⬡</div>

      <form className={styles.loginBox} onSubmit={handleSubmit}>
        <div className={styles.titleArea}>
          <h1>안녕하세요!</h1>
          <p>COMBEE 사용을 위해 아이디 및 비밀번호를 입력해주세요</p>
        </div>

        <div className={styles.formArea}>
          <div className={styles.inputBox}>
            <span className={styles.icon}>✉</span>

            <input
              name="email"
              type="email"
              placeholder="아이디 및 이메일을 입력해주세요"
              value={loginData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputBox}>
            <span className={styles.icon}>🔒</span>

            <input
              name="password"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={loginData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className={styles.loginButton} type="submit">
            로그인
          </button>
        </div>
      </form>

      <div className={styles.links}>
        <div>
          <span>아이디를 잊었나요?</span>
          <Link href="/auth/find-id">아이디 찾기</Link>

          <span className={styles.spacing}>비밀번호를 잊었나요?</span>
          <Link href="/auth/find-password">비밀번호 찾기</Link>
        </div>

        <div>
          <span>아직 회원이 아닌가요?</span>
          <Link href="/auth/signup">회원가입하기</Link>
        </div>
      </div>
    </main>
  );
}