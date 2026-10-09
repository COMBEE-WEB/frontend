"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/common/Sidebar";
import styles from "./Account.module.css";
import ConversationHistory from "@/components/ai/ConversationHistory";
import RecentEstimates from "@/components/home/RecentEstimates";
import BrandMark from "@/components/common/BrandMark";
import { useRouter } from "next/navigation";
import { authRequest } from "@/lib/auth";

export default function AccountPage() {
  const router = useRouter();
  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let active = true;
    authRequest("me").then((data) => { if (active) setAccount(data); }).catch((error) => {
      if (!active) return;
      if (error.status === 401) router.replace("/auth");
      else setError(error.message);
    });
    return () => { active = false; };
  }, [router]);

  async function logout() {
    setPending(true);
    setError("");
    try {
      await authRequest("logout");
      router.replace("/auth");
      router.refresh();
    } catch (error) {
      setError(error.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>
      <section className="mx-auto max-w-3xl rounded border border-slate-300 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-center gap-3 border-b border-slate-200 pb-6 text-2xl font-extrabold tracking-wide text-amber-600"><BrandMark size={44}/> COMBEE</div>
        <h1 className="mb-2 text-2xl font-bold">마이페이지</h1>
        {error && <p role="alert" className="my-4 text-red-700">{error}</p>}
        {!account && !error && <p role="status">회원 정보를 불러오는 중…</p>}
        {account && <>
          <p className="mb-8 text-zinc-600">{account.profile?.nickname || "회원"}님, 환영합니다.</p>
          <dl className="grid grid-cols-[6rem_1fr] gap-4 break-all">
            <dt>이메일</dt><dd>{account.user.email}</dd>
            <dt>아이디</dt><dd>{account.member?.login_id || "—"}</dd>
            <dt>이름</dt><dd>{account.member?.full_name || "—"}</dd>
          </dl>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/auth/change-password" className="rounded-lg border px-5 py-3">비밀번호 변경</Link>
            <button onClick={logout} disabled={pending} className="rounded-lg border px-5 py-3 disabled:opacity-50">
              {pending ? "로그아웃 중…" : "로그아웃"}
            </button>
          </div>
          <section className="mt-10 border-t border-slate-200 pt-6" aria-labelledby="my-estimates-title">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 id="my-estimates-title" className="text-xl font-bold">내가 만든 견적</h2>
              <Link href="/ai/chat" className="text-sm text-amber-700">새 견적 만들기 →</Link>
            </div>
            <RecentEstimates account={account} />
          </section>
          <section id="conversation-history" className="mt-10 border-t border-slate-200 pt-6" aria-labelledby="conversation-title">
            <h2 id="conversation-title" className="mb-4 text-xl font-bold">AI 대화 기록</h2>
            <ConversationHistory />
          </section>
        </>}
      </section>
      </main>
    </div>
  );
}
