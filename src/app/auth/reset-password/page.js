"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { authRequest } from "@/lib/auth";
import styles from "@/components/auth/ChangePassword.module.css";

export default function ResetPasswordPage() {
  const started = useRef(false);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hash.get("access_token");
    window.history.replaceState(null, "", window.location.pathname);
    async function establishRecovery() {
      if (hash.has("error") || hash.has("error_code")) {
        throw new Error("재설정 링크가 만료되었거나 이미 사용되었습니다. 새 메일을 요청해주세요.");
      }
      if (!accessToken) return authRequest("recovery-status");
      if (hash.get("type") !== "recovery") throw new Error("비밀번호 재설정 메일의 링크를 열어주세요.");
      return authRequest("recovery-session", { access_token: accessToken });
    }
    establishRecovery()
      .then((data) => { setEmail(data.email); setReady(true); }).catch((error) => setError(error.message));
  }, []);
  async function submit(event) {
    event.preventDefault();
    if (pending || !ready) return;
    if (password !== confirm) { setError("새 비밀번호가 서로 일치하지 않습니다."); return; }
    setPending(true); setError("");
    try {
      await authRequest("reset-password", { newPassword: password });
      setPassword(""); setConfirm(""); setDone(true);
    } catch (error) { setError(error.message); }
    finally { setPending(false); }
  }
  return <main className={styles.container}>
    <div className={styles.logo}>⬡</div>
    <section className={styles.changeBox}>
      <div className={styles.titleArea}><h1>비밀번호 재설정</h1><p>새 비밀번호는 8자 이상 입력해주세요.</p></div>
      {error && <p role="alert">{error}</p>}
      {email && <p>{email}</p>}
      {done ? <div role="status"><p>비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.</p><Link href="/auth">로그인하기</Link></div>
        : ready ? <form onSubmit={submit}>
          <div className={styles.inputBox}><input aria-label="새 비밀번호" type="password" placeholder="새 비밀번호" autoComplete="new-password"
            value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} maxLength={128} required /></div>
          <div className={styles.inputBox}><input aria-label="새 비밀번호 확인" type="password" placeholder="새 비밀번호 확인" autoComplete="new-password"
            value={confirm} onChange={(event) => setConfirm(event.target.value)} minLength={8} maxLength={128} required /></div>
          <button className={styles.changeButton} disabled={pending}>{pending ? "변경 중…" : "비밀번호 재설정"}</button>
        </form> : !error && <p role="status">재설정 링크를 확인하는 중…</p>}
      {!done && <Link href="/auth/find-password">재설정 메일 다시 요청</Link>}
    </section>
  </main>;
}
