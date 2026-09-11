"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./FindPassword.module.css";

export default function FindPassword() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // 1단계: 이메일 인증번호 요청
  const handleEmailSubmit = (event) => {
    event.preventDefault();

    console.log("인증번호를 요청할 이메일:", formData.email);

    // 나중에 백엔드 인증번호 요청 API 연결
    setStep(2);
  };

  // 2단계: 인증번호 확인
  const handleCodeSubmit = (event) => {
    event.preventDefault();

    console.log("입력한 인증번호:", formData.verificationCode);

    // 나중에 백엔드 인증번호 확인 API 연결
    setStep(3);
  };

  // 3단계: 비밀번호 변경
  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      alert("비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    console.log("변경할 비밀번호:", formData.password);

    // 나중에 백엔드 비밀번호 변경 API 연결
    alert("비밀번호가 변경되었습니다.");

    router.push("/auth");
  };

  return (
    <main className={styles.container}>
      <div className={styles.logo}>⬡</div>

      <section className={styles.findBox}>
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <div className={styles.titleArea}>
              <h1>비밀번호 찾기</h1>
              <p>비밀번호를 찾기 위해 이메일을 입력해주세요</p>
            </div>

            <div className={styles.inputBox}>
              <span className={styles.icon}>✉</span>

              <input
                name="email"
                type="email"
                placeholder="이메일을 입력해주세요"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <button className={styles.button} type="submit">
              인증번호 요청
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleCodeSubmit}>
            <div className={styles.titleArea}>
              <h1>비밀번호 찾기</h1>
              <p>이메일을 통해 인증번호를 입력해주세요</p>
            </div>

            <div className={styles.inputBox}>
              <span className={styles.icon}>🔒</span>

              <input
                name="verificationCode"
                type="text"
                inputMode="numeric"
                placeholder="인증번호를 입력해주세요"
                value={formData.verificationCode}
                onChange={handleChange}
                required
              />
            </div>

            <button className={styles.button} type="submit">
              인증번호 입력
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordSubmit}>
            <div className={styles.titleArea}>
              <h1>비밀번호 찾기</h1>
              <p>변경할 비밀번호와 비밀번호 재확인을 정확히 입력해주세요</p>
            </div>

            <div className={styles.inputBox}>
              <span className={styles.icon}>🔒</span>

              <input
                name="password"
                type="password"
                placeholder="변경할 비밀번호를 입력해주세요"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputBox}>
              <span className={styles.icon}>🔒</span>

              <input
                name="passwordConfirm"
                type="password"
                placeholder="비밀번호를 한번 더 입력해주세요"
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
              />
            </div>

            <button className={styles.button} type="submit">
              비밀번호 변경
            </button>
          </form>
        )}
      </section>
    </main>
  );
}