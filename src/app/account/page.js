"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bot, FileText, LockKeyhole, LogOut, MessageCircle, Pencil, Settings2 } from "lucide-react";
import Sidebar from "@/components/common/Sidebar";
import BrandMark from "@/components/common/BrandMark";
import ConversationHistory from "@/components/ai/ConversationHistory";
import RecentEstimates from "@/components/home/RecentEstimates";
import { authRequest } from "@/lib/auth";
import styles from "./Account.module.css";

//-------------------
// 계정 정보와 활동 내역을 카드 형태로 표시합니다.
//-------------------
export default function AccountPage() {
    const router = useRouter();
    const [account, setAccount] = useState(null);
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);
    const [estimateSummary, setEstimateSummary] = useState(null);
    const [conversationSummary, setConversationSummary] = useState(null);
    const [estimateFavoritesOnly, setEstimateFavoritesOnly] = useState(false);
    const [conversationFavoritesOnly, setConversationFavoritesOnly] = useState(false);
    const [editingProfile, setEditingProfile] = useState(false);
    const [nickname, setNickname] = useState("");
    const [profilePending, setProfilePending] = useState(false);
    const [profileError, setProfileError] = useState("");
    const [profileMessage, setProfileMessage] = useState("");

    useEffect(() => {
        let active = true;
        authRequest("me").then((data) => {
            if (active) {
                setAccount(data);
            }
        }).catch((requestError) => {
            if (!active) {
                return;
            }
            if (requestError.status === 401) {
                router.replace("/auth");
            } else {
                setError(requestError.message);
            }
        });
        return () => {
            active = false;
        };
    }, [router]);

    //-------------------
    // 서버 세션을 종료하고 로그인 화면으로 이동합니다.
    //-------------------
    async function logout() {
        setPending(true);
        setError("");
        try {
            await authRequest("logout");
            router.replace("/auth");
            router.refresh();
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setPending(false);
        }
    }

    //-------------------
    // 현재 닉네임으로 수정 입력창을 엽니다.
    //-------------------
    function startProfileEdit() {
        setNickname(account?.profile?.nickname || "");
        setProfileError("");
        setProfileMessage("");
        setEditingProfile(true);
    }

    //-------------------
    // 수정한 닉네임을 저장하고 화면의 프로필을 갱신합니다.
    //-------------------
    async function saveProfile(event) {
        event.preventDefault();
        const value = nickname.trim();
        if (!value) {
            setProfileError("닉네임을 입력해주세요.");
            return;
        }
        setProfilePending(true);
        setProfileError("");
        try {
            const result = await authRequest("profile", { nickname: value });
            setAccount((previous) => ({ ...previous, profile: result.profile }));
            setEditingProfile(false);
            setProfileMessage("프로필을 저장했습니다.");
        } catch (requestError) {
            setProfileError(requestError.message);
        } finally {
            setProfilePending(false);
        }
    }

    const displayName = account?.profile?.nickname || account?.member?.full_name || "COMBEE 사용자";

    return (
        <div className={styles.shell}>
            <Sidebar />
            <main className={styles.main}>
                <div className={styles.content}>
                    <h1 className={styles.pageTitle}>마이페이지</h1>
                    {error && <p role="alert" className={styles.error}>{error}</p>}
                    {!account && !error && <p role="status" className={styles.loading}>회원 정보를 불러오는 중…</p>}
                    {account && (
                        <>
                            <section className={styles.profileCard} aria-label="프로필 정보">
                                <div className={styles.avatar} aria-hidden="true"><BrandMark size={64} /></div>
                                <div className={styles.profileDetails}>
                                    <h2>{displayName}</h2>
                                    <p>{account.user?.email || "이메일 정보 없음"}</p>
                                    <p className={styles.accountId}>아이디&nbsp; {account.member?.login_id || "—"}</p>
                                </div>
                                {!editingProfile && <button type="button" className={styles.editButton} onClick={startProfileEdit}><Pencil size={17} />프로필 수정</button>}
                                {editingProfile && (
                                    <form className={styles.profileForm} onSubmit={saveProfile}>
                                        <label htmlFor="profile-nickname">닉네임</label>
                                        <div className={styles.profileFormControls}>
                                            <input id="profile-nickname" value={nickname} onChange={(event) => setNickname(event.target.value)} maxLength={30} autoComplete="nickname" required />
                                            <button type="submit" disabled={profilePending}>{profilePending ? "저장 중…" : "저장"}</button>
                                            <button type="button" disabled={profilePending} onClick={() => setEditingProfile(false)}>취소</button>
                                        </div>
                                        {profileError && <p role="alert" className={styles.profileError}>{profileError}</p>}
                                    </form>
                                )}
                            </section>
                            {profileMessage && <p role="status" className={styles.profileMessage}>{profileMessage}</p>}

                            <div className={styles.summaryGrid} aria-label="내 활동 요약">
                                <a className={styles.summaryCard} href="#my-estimates-title">
                                    <span className={styles.iconBubble}><FileText size={29} /></span>
                                    <span><span className={styles.summaryLabel}>저장한 견적</span><strong>{estimateSummary === null ? "—" : `${estimateSummary.count}${estimateSummary.hasMore ? "+" : ""}`}</strong></span>
                                </a>
                                <a className={styles.summaryCard} href="#conversation-title">
                                    <span className={styles.iconBubble}><MessageCircle size={29} /></span>
                                    <span><span className={styles.summaryLabel}>AI 대화</span><strong>{conversationSummary === null ? "—" : `${conversationSummary.count}${conversationSummary.hasMore ? "+" : ""}`}</strong></span>
                                </a>
                            </div>

                            <div className={styles.recordsGrid}>
                                <section className={styles.recordsCard} aria-labelledby="my-estimates-title">
                                    <div className={styles.cardHeading}>
                                        <span className={styles.iconBubble}><FileText size={23} /></span>
                                        <h2 id="my-estimates-title">내가 만든 견적</h2>
                                        <label className={styles.favoriteFilter}>
                                            <input type="checkbox" checked={estimateFavoritesOnly} onChange={(event) => setEstimateFavoritesOnly(event.target.checked)} />
                                            즐겨찾기만 보기
                                        </label>
                                    </div>
                                    <div className={styles.historyViewport} role="region" aria-label="내가 만든 견적 목록" tabIndex={0}>
                                        <RecentEstimates account={account} accountView onlyFavorites={estimateFavoritesOnly} onSummaryChange={setEstimateSummary} />
                                    </div>
                                    <Link href="/ai/question" className={styles.primaryButton}>첫 견적 만들기</Link>
                                </section>
                                <section id="conversation-history" className={styles.recordsCard} aria-labelledby="conversation-title">
                                    <div className={styles.cardHeading}>
                                        <span className={styles.iconBubble}><Bot size={23} /></span>
                                        <h2 id="conversation-title">AI 대화 기록</h2>
                                        <label className={styles.favoriteFilter}>
                                            <input type="checkbox" checked={conversationFavoritesOnly} onChange={(event) => setConversationFavoritesOnly(event.target.checked)} />
                                            즐겨찾기만 보기
                                        </label>
                                    </div>
                                    <div className={styles.historyViewport} role="region" aria-label="AI 대화 목록" tabIndex={0}>
                                        <ConversationHistory onlyFavorites={conversationFavoritesOnly} onSummaryChange={setConversationSummary} />
                                    </div>
                                    <Link href="/ai/chat" className={styles.primaryButton}>AI와 대화하기</Link>
                                </section>
                            </div>

                            <section className={styles.settingsCard} aria-label="계정 설정">
                                <div className={styles.settingsTitle}><span className={styles.iconBubble}><Settings2 size={22} /></span><h2>계정 설정</h2></div>
                                <div className={styles.settingsActions}>
                                    <Link href="/auth/change-password" className={styles.secondaryButton}><LockKeyhole size={17} />비밀번호 변경</Link>
                                    <button type="button" onClick={logout} disabled={pending} className={styles.secondaryButton}><LogOut size={17} />{pending ? "로그아웃 중…" : "로그아웃"}</button>
                                </div>
                            </section>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
