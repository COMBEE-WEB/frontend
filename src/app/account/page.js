"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
    <main className="min-h-screen bg-slate-100 px-6 py-16 text-zinc-900">
      <section className="mx-auto max-w-lg rounded border border-slate-300 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-5 font-bold text-slate-800"><BrandMark size={32}/> COMBEE</div>
        <h1 className="mb-2 text-2xl font-bold">내 계정</h1>
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
            <Link href="/ai/chat" className="rounded-lg bg-amber-400 px-5 py-3 font-semibold">COMBEE 시작하기</Link>
            <button onClick={logout} disabled={pending} className="rounded-lg border px-5 py-3 disabled:opacity-50">
              {pending ? "로그아웃 중…" : "로그아웃"}
            </button>
          </div>
        </>}
      </section>
    </main>
  );
}
