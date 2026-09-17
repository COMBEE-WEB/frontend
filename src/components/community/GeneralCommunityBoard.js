"use client";

import { useState } from "react";
import { CircleUserRound, MessageCircle, Send, X } from "lucide-react";
import CommunityNavigation from "./CommunityNavigation";
import styles from "./GeneralCommunityBoard.module.css";

const initialPosts = [
    {
        id: 1,
        author: "송민창",
        account: "@ONIN",
        title: "오늘 하루 어떠셨나요?",
        content: "오늘 있었던 일이나 재미있는 이야기를 자유롭게 나눠주세요!",
        createdAt: "2026-09-17 22:10",
        comments: [
            {
                id: 1,
                author: "김우진",
                account: "@MooWoon",
                content: "오늘도 다들 수고 많으셨어요!",
            },
        ],
    },
    {
        id: 2,
        author: "엄유준",
        account: "@Eddie",
        title: "요즘 할 만한 게임 추천해주세요",
        content: "친구들과 함께 즐길 수 있는 게임을 찾고 있어요.",
        createdAt: "2026-09-17 20:45",
        comments: [
             {
                id: 1,
                author: "김우진",
                account: "@MooWoon",
                content: "서든어택 ㄱㄱ!",
            },
            {
                id: 2,
                author: "송민창",
                account: "@ONIN",
                content: "우진아 닌 서든도 못하잖아 ㅋㅋ",
            },
        ],
    },
    {
        id: 3,
        author: "김우진",
        account: "@MooWoon",
        title: "새 컴퓨터 맞추고 첫 글 남깁니다",
        content: "부품 정보를 참고해서 조립을 끝냈습니다. 반갑습니다!",
        createdAt: "2026-09-17 18:20",
        comments: [
            {
                id: 1,
                author: "엄유준",
                account: "@Eddie",
                content: "어 그래 반갑고",
            },
            {
                id: 2,
                author: "송민창",
                account: "@ONIN",
                content: "우진아 그럴 시간에 프로젝트나 좀.. 열심히..",
            },
        ],
    },
];

// 자유 게시판 목록과 작성 기능 표시
export default function GeneralCommunityBoard()
{
    const [posts, setPosts] = useState(initialPosts);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [commentText, setCommentText] = useState("");

    const selectedPost = posts.find((post) => post.id === selectedPostId);

    // 새 자유 게시글 등록
    function handleSubmitPost(event)
    {
        event.preventDefault();

        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (!trimmedTitle || !trimmedContent)
        {
            return;
        }

        setPosts(
            (currentPosts) => [
                {
                    id: Date.now(),
                    author: "송민창",
                    account: "@ONIN",
                    title: trimmedTitle,
                    content: trimmedContent,
                    createdAt: "방금 전",
                    comments: [],
                },
                ...currentPosts,
            ]
        );
        setTitle("");
        setContent("");
    }

    // 선택한 자유 게시글 상세 창 열기
    function handleOpenPost(postId)
    {
        setSelectedPostId(postId);
        setCommentText("");
    }

    // 자유 게시글 상세 창 닫기
    function handleClosePost()
    {
        setSelectedPostId(null);
        setCommentText("");
    }

    // 선택한 자유 게시글에 댓글 등록
    function handleSubmitComment(event)
    {
        event.preventDefault();

        const trimmedComment = commentText.trim();

        if (!trimmedComment || !selectedPost)
        {
            return;
        }

        setPosts(
            (currentPosts) => currentPosts.map(
                (post) =>
                {
                    if (post.id !== selectedPost.id)
                    {
                        return post;
                    }

                    return {
                        ...post,
                        comments: [
                            ...post.comments,
                            {
                                id: Date.now(),
                                author: "송민창",
                                account: "@ONIN",
                                content: trimmedComment,
                            },
                        ],
                    };
                }
            )
        );
        setCommentText("");
    }

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <CommunityNavigation activeBoard="free" />

                <header className={styles.header}>
                    <p className={styles.eyebrow}>FREE COMMUNITY</p>
                    <h1>오늘 하루는 어떠세요?</h1>
                    <p>오늘 하루 및 컴퓨터에 대해서 가볍게 이야기해보세요!</p>
                </header>

                <form className={styles.writeCard} onSubmit={handleSubmitPost}>
                    <div className={styles.authorRow}>
                        <CircleUserRound aria-hidden="true" />
                        <div>
                            <strong>송민창</strong>
                            <span>@ONIN</span>
                        </div>
                    </div>

                    <label className={styles.field}>
                        <span className={styles.srOnly}>게시글 제목</span>
                        <input
                            type="text"
                            value={title}
                            placeholder="제목을 입력하세요"
                            onChange={(event) => setTitle(event.target.value)}
                        />
                    </label>

                    <label className={styles.field}>
                        <span className={styles.srOnly}>게시글 내용</span>
                        <textarea
                            value={content}
                            placeholder="자유롭게 이야기를 나눠보세요"
                            onChange={(event) => setContent(event.target.value)}
                        />
                    </label>

                    <div className={styles.writeActions}>
                        <button type="submit" className={styles.submitButton}>
                            <Send size={16} aria-hidden="true" />
                            글쓰기
                        </button>
                    </div>
                </form>

                <section className={styles.listSection} aria-labelledby="free-list-title">
                    <div className={styles.listHeader}>
                        <h2 id="free-list-title">자유 게시글</h2>
                        <span>{posts.length}개의 글</span>
                    </div>

                    <ul className={styles.postList}>
                        {posts.map(
                            (post) =>
                            {
                                return (
                                    <li key={post.id}>
                                        <button
                                            type="button"
                                            className={styles.postButton}
                                            onClick={() => handleOpenPost(post.id)}
                                        >
                                            <span className={styles.postAuthor}>
                                                <CircleUserRound aria-hidden="true" />
                                                <span>
                                                    <strong>{post.author}</strong>
                                                    <small>{post.account}</small>
                                                </span>
                                            </span>

                                            <span className={styles.postTitle}>{post.title}</span>

                                            <span className={styles.postMeta}>
                                                <MessageCircle size={14} aria-hidden="true" />
                                                {post.comments.length}
                                                <time>{post.createdAt}</time>
                                            </span>
                                        </button>
                                    </li>
                                );
                            }
                        )}
                    </ul>
                </section>
            </div>

            {selectedPost && (
                <div className={styles.backdrop} role="presentation" onClick={handleClosePost}>
                    <section
                        className={styles.modal}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="free-detail-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className={styles.closeButton}
                            aria-label="게시글 닫기"
                            onClick={handleClosePost}
                        >
                            <X aria-hidden="true" />
                        </button>

                        <article className={styles.detail}>
                            <div className={styles.detailAuthor}>
                                <CircleUserRound aria-hidden="true" />
                                <div>
                                    <strong>{selectedPost.author}</strong>
                                    <span>{selectedPost.account}</span>
                                </div>
                            </div>
                            <h2 id="free-detail-title">{selectedPost.title}</h2>
                            <p>{selectedPost.content}</p>
                            <time>{selectedPost.createdAt}</time>
                        </article>

                        <section className={styles.comments} aria-labelledby="free-comment-title">
                            <h3 id="free-comment-title">댓글</h3>

                            <ul className={styles.commentList}>
                                {selectedPost.comments.length === 0 && (
                                    <li className={styles.emptyComment}>첫 댓글을 남겨보세요.</li>
                                )}

                                {selectedPost.comments.map(
                                    (comment) =>
                                    {
                                        return (
                                            <li key={comment.id} className={styles.comment}>
                                                <div className={styles.commentAuthor}>
                                                    <strong>{comment.author}</strong>
                                                    <span>{comment.account}</span>
                                                </div>
                                                <p>{comment.content}</p>
                                            </li>
                                        );
                                    }
                                )}
                            </ul>

                            <form className={styles.commentForm} onSubmit={handleSubmitComment}>
                                <label>
                                    <span className={styles.srOnly}>댓글 입력</span>
                                    <input
                                        type="text"
                                        value={commentText}
                                        placeholder="댓글을 입력하세요"
                                        onChange={(event) => setCommentText(event.target.value)}
                                    />
                                </label>
                                <button type="submit">등록</button>
                            </form>
                        </section>
                    </section>
                </div>
            )}
        </main>
    );
}
