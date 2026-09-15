"use client";

import { useState } from "react";
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

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isAiOpen, setIsAiOpen] = useState(
    pathname.startsWith("/ai"),
  );

  const handleLogout = () => {
    alert("로그아웃되었습니다.");
    router.push("/auth");
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

        <Link
          href="/community"
          className={`${styles.menuItem} ${
            checkActive("/community")
              ? styles.active
              : ""
          }`}
        >
          <UsersRound size={18} />
          <span>커뮤니티</span>
        </Link>

        <Link
          href="/settings"
          className={`${styles.menuItem} ${
            checkActive("/settings")
              ? styles.active
              : ""
          }`}
        >
          <Settings size={18} />
          <span>설정</span>
        </Link>
      </nav>

      <button
        className={styles.logoutButton}
        type="button"
        onClick={handleLogout}
      >
        <LogOut size={18} />
        <span>로그아웃</span>
      </button>
    </aside>
  );
}