"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import styles from "./ChangePassword.module.css";
import Link from "next/link";
import { authRequest } from "@/lib/auth";

export default function ChangePassword() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (pending) return;
    setError("");

    if (
      passwordData.newPassword !==
      passwordData.newPasswordConfirm
    ) {
      setError("새 비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    if (
      passwordData.currentPassword ===
      passwordData.newPassword
    ) {
      setError("현재 비밀번호와 다른 비밀번호를 입력해주세요.");
      return;
    }

    setPending(true);
    try {
      await authRequest("change-password", { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
      setPasswordData({ currentPassword: "", newPassword: "", newPasswordConfirm: "" });
      setDone(true);
      router.refresh();
    } catch (error) { setError(error.message); }
    finally { setPending(false); }
  };

  return (
    <main className={styles.container}>
      <div className={styles.logo}>⬡</div>

      <form
        className={styles.changeBox}
        onSubmit={handleSubmit}
      >
        <div className={styles.titleArea}>
          <h1>비밀번호 변경</h1>
          <p>
            현재 비밀번호와 변경할 비밀번호를 입력해주세요
          </p>
        </div>

        {done ? <div role="status"><p>비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.</p><Link href="/auth">로그인하기</Link></div> : <>
        <PasswordInput
          name="currentPassword"
          placeholder="현재 비밀번호를 입력해주세요"
          value={passwordData.currentPassword}
          onChange={handleChange}
        />

        <PasswordInput
          name="newPassword"
          placeholder="새 비밀번호를 입력해주세요"
          value={passwordData.newPassword}
          onChange={handleChange}
        />

        <PasswordInput
          name="newPasswordConfirm"
          placeholder="새 비밀번호를 한 번 더 입력해주세요"
          value={passwordData.newPasswordConfirm}
          onChange={handleChange}
        />

        {error && <p role="alert">{error}</p>}
        <button className={styles.changeButton} type="submit" disabled={pending}>
          {pending ? "변경 중…" : "비밀번호 변경"}
        </button>
        <Link href="/auth/find-password">현재 비밀번호를 잊었나요?</Link>
        </>}
      </form>
    </main>
  );
}

function PasswordInput({
  name,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className={styles.inputBox}>
      <span className={styles.icon}>
        <LockKeyhole />
      </span>

      <input
        name={name}
        type="password"
        minLength={name === "currentPassword" ? 1 : 8}
        maxLength={128}
        autoComplete={name === "currentPassword" ? "current-password" : "new-password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
}
