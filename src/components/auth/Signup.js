"use client";

import BrandMark from "@/components/common/BrandMark";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authRequest } from "@/lib/auth";
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
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (pending || completed) return;
    setPending(true);
    setError("");
    try {
      const result = await authRequest("signup", signupData);
      setSignupData((data) => ({ ...data, password: "" }));
      if (result.email_confirmation_required) {
        setCompleted(true);
      } else {
        router.replace("/account");
        router.refresh();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.logo}><BrandMark size={54}/></div>

      <form className={styles.signupBox} onSubmit={handleSubmit}>
        <div className={styles.titleArea}>
          <h1>환영합니다</h1>
          <p>COMBEE의 새로운 회원을 위해 아래 정보를 입력해주세요</p>
        </div>

        {completed ? (
          <div role="status" className={styles.formArea}>
            <p>가입 요청이 접수되었습니다. {signupData.email}에서 인증 메일을 확인한 뒤 로그인해주세요.</p>
            <Link href="/auth">로그인으로 이동</Link>
          </div>
        ) : <div className={styles.formArea}>
          <InputBox
            icon={<UserRound />}
            name="userId"
            type="text"
            placeholder="아이디 (영문·숫자·밑줄 3~30자)"
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
            placeholder="비밀번호 (8자 이상)"
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

          {error && <p role="alert">{error}</p>}
          <button className={styles.signupButton} type="submit" disabled={pending}>
            {pending ? "가입 요청 중…" : "회원가입"}
          </button>
        </div>}
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
        minLength={name === "password" ? 8 : name === "userId" ? 3 : undefined}
        maxLength={name === "password" ? 128 : name === "userId" ? 30 : undefined}
        pattern={name === "userId" ? "[A-Za-z0-9_]+" : name === "birthDate" ? "[0-9]{8}" : undefined}
        autoComplete={name === "password" ? "new-password" : name === "email" ? "email" : undefined}
        required
      />
    </div>
  );
}
