"use client";

import { useState } from "react";
import { CircleUserRound, Send, X } from "lucide-react";
import styles from "./EstimateCommunityBoard.module.css";

const initialPosts = [
    {
        id: 1,
        author: "송민창",
        account: "@dncks0625",
        title: "님들 견적 이거 맞음?",
        content: "견적 이렇게 샀는데 어떤 것 같아요?",
        estimate: "CPU 인텔 코어 i5 / 메모리 32GB / 그래픽카드 RTX 4060",
        createdAt: "2026-09-17 10:30",
        comments: [
            {
                id: 1,
                author: "김우진",
                content: "좋은거 같아요!",
            },
        ],
    },
    {
        id: 2,
        author: "송민창",
        account: "@dncks0625",
        title: "게임용 컴퓨터 견적 확인 부탁드려요!",
        content: "FHD 환경에서 게임용으로 사용할 예정입니다.",
        estimate: "CPU AMD 라이젠 5 / 메모리 16GB / 그래픽카드 RTX 4060",
        createdAt: "2026-09-17 09:45",
        comments: [],
    },
];

// 견적 공유 게시판 목록과 작성 기능 표시
export default function EstimateCommunityBoard()
{
    const [posts, setPosts] = useState(initialPosts);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [commentText, setCommentText] = useState("");

    const selectedPost = posts.find((post) => post.id === selectedPostId);

    // 새 견적 공유 글 등록
    function handleSubmitPost(event)
    {
        event.preventDefault();

        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (!trimmedTitle || !trimmedContent)
        {
            return;
        }

        const newPost = {
            id: Date.now(),
            author: "송민창",
            account: "@dncks0625",
            title: trimmedTitle,
            content: trimmedContent,
            estimate: "작성한 견적 정보가 이곳에 표시됩니다.",
            createdAt: "방금 전",
            comments: [],
        };

        setPosts((currentPosts) => [newPost, ...currentPosts]);
        setTitle("");
        setContent("");
    }

    // 선택한 게시글 상세 창 열기
    function handleOpenPost(postId)
    {
        setSelectedPostId(postId);
        setCommentText("");
    }

    // 게시글 상세 창 닫기
    function handleClosePost()
    {
        setSelectedPostId(null);
        setCommentText("");
    }

    // 선택한 게시글에 댓글 등록
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
                                author: "김우진",
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
                <header className={styles.header}>
                    <p className={styles.eyebrow}>ESTIMATE COMMUNITY</p>
                    <h1>견적을 공유해보세요!</h1>
                    <p>AI 및 직접 맞춘 견적을 사람들과 공유하고 의견을 나눠보세요!</p>
                </header>

                <form className={styles.writeCard} onSubmit={handleSubmitPost}>
                    <div className={styles.authorRow}>
                        <CircleUserRound aria-hidden="true" />
                        <div>
                            <strong>송민창</strong>
                            <span>@dncks0625</span>
                        </div>
                    </div>

                    <label className={styles.field}>
                        <span className={styles.srOnly}>게시글 제목</span>
                        <input
                            type="text"
                            value={title}
                            placeholder="공유할 견적의 제목을 입력하세요"
                            onChange={(event) => setTitle(event.target.value)}
                        />
                    </label>

                    <label className={styles.field}>
                        <span className={styles.srOnly}>게시글 내용</span>
                        <textarea
                            value={content}
                            placeholder="견적에 대한 설명이나 궁금한 점을 적어주세요"
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

                <section className={styles.listSection} aria-labelledby="community-list-title">
                    <div className={styles.listHeader}>
                        <h2 id="community-list-title">공유된 견적</h2>
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

                                            <span className={styles.postTitle}>
                                                {post.title}
                                            </span>

                                            <span className={styles.postMeta}>
                                                댓글 {post.comments.length} · {post.createdAt}
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
                        aria-labelledby="community-detail-title"
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

                            <h2 id="community-detail-title">{selectedPost.title}</h2>
                            <p>{selectedPost.content}</p>
                            <div className={styles.estimateBox}>{selectedPost.estimate}</div>
                            <time>{selectedPost.createdAt}</time>
                        </article>

                        <section className={styles.comments} aria-labelledby="comment-title">
                            <h3 id="comment-title">댓글</h3>

                            <ul className={styles.commentList}>
                                {selectedPost.comments.length === 0 && (
                                    <li className={styles.emptyComment}>첫 댓글을 남겨보세요.</li>
                                )}

                                {selectedPost.comments.map(
                                    (comment) =>
                                    {
                                        return (
                                            <li key={comment.id} className={styles.comment}>
                                                <strong>{comment.author}</strong>
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
