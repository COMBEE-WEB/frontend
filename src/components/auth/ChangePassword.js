"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import styles from "./ChangePassword.module.css";

export default function ChangePassword() {
  const router = useRouter();

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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      passwordData.newPassword !==
      passwordData.newPasswordConfirm
    ) {
      alert("새 비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    if (
      passwordData.currentPassword ===
      passwordData.newPassword
    ) {
      alert("현재 비밀번호와 다른 비밀번호를 입력해주세요.");
      return;
    }

    console.log("비밀번호 변경 정보:", passwordData);

    // 나중에 백엔드 비밀번호 변경 API 연결
    alert("비밀번호가 변경되었습니다.");

    router.push("/auth");
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

        <button className={styles.changeButton} type="submit">
          비밀번호 변경
        </button>
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
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
}