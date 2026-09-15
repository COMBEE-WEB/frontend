"use client";

import { useState } from "react";
import styles from "./PartListDetail.module.css";

//-------------------
// 제품별 댓글 목록과 입력창 표시
//-------------------
export default function PartComments({ productId })
{
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([
        {
            id: `${productId}-sample`,
            author: "사용자",
            content: "이 부품 어떤가요?",
        },
    ]);

    //-------------------
    // 입력한 댓글을 목록에 등록
    //-------------------
    function handleSubmit(event)
    {
        event.preventDefault();

        const content = commentText.trim();

        if (!content)
        {
            return;
        }

        setComments(
            (currentComments) =>
            {
                return [
                    ...currentComments,
                    {
                        id: `${productId}-${Date.now()}`,
                        author: "나",
                        content,
                    },
                ];
            }
        );
        setCommentText("");
    }

    return (
        <section className={styles.comments} aria-labelledby="comments-title">
            <h2 id="comments-title" className={styles.commentsTitle}>댓글</h2>

            <ul className={styles.commentList}>
                {comments.map(
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

            <form className={styles.commentForm} onSubmit={handleSubmit}>
                <label className={styles.srOnly} htmlFor={`comment-${productId}`}>
                    댓글 내용
                </label>
                <input
                    id={`comment-${productId}`}
                    type="text"
                    value={commentText}
                    placeholder="댓글을 입력하세요"
                    onChange={
                        (event) =>
                        {
                            setCommentText(event.target.value);
                        }
                    }
                />
                <button type="submit">등록</button>
            </form>
        </section>
    );
}
