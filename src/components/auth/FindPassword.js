"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { authRequest } from "@/lib/auth";
import styles from "./FindPassword.module.css";

export default function FindPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function sendCode(event) {
    event?.preventDefault();
    if (pending || cooldown) return;
    setPending(true); setError("");
    try {
      await authRequest("forgot-password", { email });
      setCode(""); setStep(2); setCooldown(60);
    } catch (error) {
      setError(error.message);
      if (error.status === 429) setCooldown(60);
    } finally { setPending(false); }
  }
  async function verifyCode(event) {
    event.preventDefault();
    if (pending) return;
    setPending(true); setError("");
    try {
      await authRequest("verify-recovery-code", { email, verificationCode: code });
      setCode(""); setStep(3);
    } catch (error) { setError(error.message); }
    finally { setPending(false); }
  }
  async function resetPassword(event) {
    event.preventDefault();
    if (pending) return;
    if (password !== confirm) { setError("새 비밀번호가 서로 일치하지 않습니다."); return; }
    setPending(true); setError("");
    try {
      await authRequest("reset-password", { newPassword: password });
      setPassword(""); setConfirm(""); setStep(4);
    } catch (error) {
      setError(error.message);
      if ([401, 403].includes(error.status)) setStep(2);
    } finally { setPending(false); }
  }
  return <main className={styles.container}>
    <div className={styles.logo}>⬡</div>
    <section className={styles.findBox}>
      <div className={styles.titleArea}>
        <h1>비밀번호 찾기</h1>
        <p>{step === 1 ? "이메일로 인증번호를 보내드립니다." : step === 2 ? "메일로 받은 인증번호 6~8자리를 입력해주세요." : step === 3 ? "인증이 완료되었습니다. 새 비밀번호를 설정해주세요." : "비밀번호가 변경되었습니다."}</p>
        {step < 4 && <p aria-label={`3단계 중 ${step}단계`}>{step} / 3</p>}
      </div>
      {error && <p role="alert">{error}</p>}
      {step === 1 && <form onSubmit={sendCode}>
        <div className={styles.inputBox}><input aria-label="이메일" type="email" autoComplete="email" placeholder="이메일을 입력해주세요" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} /></div>
        <button className={styles.button} disabled={pending || cooldown > 0}>{pending ? "발송 요청 중…" : cooldown ? `${cooldown}초 후 재시도` : "인증번호 보내기"}</button>
      </form>}
      {step === 2 && <form onSubmit={verifyCode}>
        <p>{email}</p><p>가입된 이메일이라면 인증번호가 발송됩니다. 스팸함도 확인해주세요.</p>
        <div className={styles.inputBox}><input aria-label="인증번호" name="verificationCode" type="text" inputMode="numeric" autoComplete="one-time-code" placeholder="인증번호 6~8자리" pattern="[0-9]{6,8}" maxLength={8} value={code} onChange={(event) => setCode(event.target.value.replace(/[^0-9]/g, ""))} required /></div>
        <button className={styles.button} disabled={pending}>{pending ? "확인 중…" : "인증번호 확인"}</button>
        <button type="button" onClick={sendCode} disabled={pending || cooldown > 0}>{cooldown ? `${cooldown}초 후 재발송 가능` : "인증번호 재발송"}</button>
        <button type="button" disabled={pending} onClick={() => { setStep(1); setCode(""); setError(""); }}>이메일 수정</button>
      </form>}
      {step === 3 && <form onSubmit={resetPassword}>
        <p>{email}</p>
        <div className={styles.inputBox}><input aria-label="새 비밀번호" type="password" autoComplete="new-password" placeholder="새 비밀번호 (8자 이상)" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} maxLength={128} required /></div>
        <div className={styles.inputBox}><input aria-label="새 비밀번호 확인" type="password" autoComplete="new-password" placeholder="새 비밀번호 확인" value={confirm} onChange={(event) => setConfirm(event.target.value)} minLength={8} maxLength={128} required /></div>
        <button className={styles.button} disabled={pending}>{pending ? "변경 중…" : "비밀번호 변경"}</button>
      </form>}
      {step === 4 && <p role="status">새 비밀번호로 로그인해주세요.</p>}
      <Link href="/auth">로그인으로 돌아가기</Link>
    </section>
  </main>;
}
