"use client";

import { useState } from "react";
import {
  UserRound,
  Mail,
  LockKeyhole,
  ContactRound,
  Phone,
  CalendarDays,
} from "lucide-react";

import styles from "./Signup.module.css";

export default function Signup() {
  const [signupData, setSignupData] = useState({
    userId: "",
    email: "",
    password: "",
    name: "",
    phone: "",
    birthDate: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSignupData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("회원가입 정보:", signupData);

    // 나중에 백엔드 회원가입 API 연결
  };

  return (
    <main className={styles.container}>
      <div className={styles.logo}>⬡</div>

      <form className={styles.signupBox} onSubmit={handleSubmit}>
        <div className={styles.titleArea}>
          <h1>환영합니다</h1>
          <p>COMBEE의 새로운 회원을 위해 아래 정보를 입력해주세요</p>
        </div>

        <div className={styles.formArea}>
          <InputBox
            icon={<UserRound />}
            name="userId"
            type="text"
            placeholder="아이디를 입력해주세요"
            value={signupData.userId}
            onChange={handleChange}
          />

          <InputBox
            icon={<Mail />}
            name="email"
            type="email"
            placeholder="이메일을 입력해주세요"
            value={signupData.email}
            onChange={handleChange}
          />

          <InputBox
            icon={<LockKeyhole />}
            name="password"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={signupData.password}
            onChange={handleChange}
          />

          <InputBox
            icon={<ContactRound />}
            name="name"
            type="text"
            placeholder="이름을 입력해주세요"
            value={signupData.name}
            onChange={handleChange}
          />

          <InputBox
            icon={<Phone />}
            name="phone"
            type="tel"
            placeholder="전화번호를 입력해주세요"
            value={signupData.phone}
            onChange={handleChange}
          />

          <InputBox
            icon={<CalendarDays />}
            name="birthDate"
            type="text"
            placeholder="생년월일을 입력해주세요 (예: 20090101)"
            value={signupData.birthDate}
            onChange={handleChange}
          />

          <button className={styles.signupButton} type="submit">
            회원가입
          </button>
        </div>
      </form>
    </main>
  );
}

function InputBox({
  icon,
  name,
  type,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className={styles.inputBox}>
      <span className={styles.icon}>{icon}</span>

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
}