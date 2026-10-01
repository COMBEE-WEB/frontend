"use client";

import { useEffect, useState } from "react";
import { authRequest } from "@/lib/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  House,
  Bot,
  Cpu,
  Wrench,
  UsersRound,
  Settings,
  LogOut,
  Boxes,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  ClipboardList,
} from "lucide-react";

import styles from "./Sidebar.module.css";

export default function Sidebar({ onAccount } = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const [account, setAccount] = useState(null);
  const [authError, setAuthError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let active = true;
    authRequest("me").then((data) => {
      if (active) { setAccount(data); onAccount?.(data); }
    }).catch((error) => {
      if (active && error.status !== 401) setAuthError(error.message);
    });
    return () => { active = false; };
  }, [onAccount]);

  const [isAiOpen, setIsAiOpen] = useState(
    pathname.startsWith("/ai"),
  );
  const [isCommunityOpen, setIsCommunityOpen] = useState(pathname.startsWith('/community'));

  const handleLogout = async () => {
    if (pending) return;
    setPending(true);
    setAuthError("");
    try {
      await authRequest("logout");
      setAccount(null);
      router.push("/auth");
      router.refresh();
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setPending(false);
    }
  };

  const checkActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.logo}>
        <Boxes size={25} />
        <span>COMBEE</span>
      </Link>

      <nav className={styles.navigation}>
        <Link
          href="/"
          className={`${styles.menuItem} ${
            pathname === "/" ? styles.active : ""
          }`}
        >
          <House size={18} />
          <span>홈</span>
        </Link>

        {/* AI 견적 메뉴 */}
        <button
          className={`${styles.menuItem} ${
            pathname.startsWith("/ai") ? styles.active : ""
          }`}
          type="button"
          onClick={() => setIsAiOpen(!isAiOpen)}
        >
          <Bot size={18} />
          <span>AI 견적</span>

          <span className={styles.arrow}>
            {isAiOpen ? (
              <ChevronDown size={15} />
            ) : (
              <ChevronRight size={15} />
            )}
          </span>
        </button>

        {/* AI 하위 메뉴 */}
        {isAiOpen && (
          <div className={styles.subMenu}>
            <Link
              href="/ai/question"
              className={`${styles.subMenuItem} ${
                pathname === "/ai/question"
                  ? styles.subActive
                  : ""
              }`}
            >
              <ClipboardList size={16} />
              <span>견적 질문</span>
            </Link>

            <Link
              href="/ai/chat"
              className={`${styles.subMenuItem} ${
                pathname === "/ai/chat"
                  ? styles.subActive
                  : ""
              }`}
            >
              <MessageCircle size={16} />
              <span>자유채팅</span>
            </Link>
          </div>
        )}

        <Link
          href="/Parts/partlist"
          className={`${styles.menuItem} ${
            checkActive("/Parts/partlist") ? styles.active : ""
          }`}
        >
          <Cpu size={18} />
          <span>부품 리스트</span>
        </Link>

        <Link
          href="/Parts/partexplaincategory"
          className={`${styles.menuItem} ${
            checkActive("/Parts/partexplaincategory")
              ? styles.active
              : ""
          }`}
        >
          <Wrench size={18} />
          <span>부품 설명</span>
        </Link>

        <button
          type="button"
          aria-expanded={isCommunityOpen}
          onClick={() => setIsCommunityOpen(value => !value)}
          className={`${styles.menuItem} ${
            checkActive("/community")
              ? styles.active
              : ""
          }`}
        >
          <UsersRound size={18} />
          <span>커뮤니티</span>
          <span className={styles.arrow}>{isCommunityOpen ? <ChevronDown size={15}/> : <ChevronRight size={15}/>}</span>
        </button>
        {isCommunityOpen && <div className={styles.subMenu}>
          <Link href="/community?board=build_share" className={styles.subMenuItem}>견적공유게시판</Link>
          <Link href="/community?board=free" className={styles.subMenuItem}>자유게시판</Link>
        </div>}

        <Link
          href="/account"
          className={`${styles.menuItem} ${
            checkActive("/account")
              ? styles.active
              : ""
          }`}
        >
          <Settings size={18} />
          <span>설정</span>
        </Link>
      </nav>

      {authError && <p role="alert">{authError}</p>}
      {account ? <button
        className={styles.logoutButton}
        type="button"
        onClick={handleLogout}
        disabled={pending}
      >
        <LogOut size={18} />
        <span>{pending ? "로그아웃 중…" : "로그아웃"}</span>
      </button> : <Link href="/auth" className={styles.logoutButton}>로그인</Link>}
    </aside>
  );
}
