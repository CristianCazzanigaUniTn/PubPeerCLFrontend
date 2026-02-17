import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import "../styles/CommentPage.css";
import { useRef } from "react";


export default function CommentPage({ apiKey, userNickname }) {
    const { id } = useParams(); // ID commento dall'URL
    const navigate = useNavigate();
    const internalNavigation = useRef(false);
    const [comment, setComment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [issubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [category, setCategory] = useState("");

    const categories = [
        "methodological concerns",
        "figure anomalies",
        "clarification",
        "data validity",
        "ethical issues",
        "external link"
    ];

    const formatComment = (doc) => {
        if (!doc) return null;
        return {
            comment_id: doc.comment_id,
            comment_content: doc.comment_content,
            is_from_author: doc.is_from_author,
            DOI: doc.doi_article,
            titolo_articolo: doc.title_article,
            autori_articolo: doc.authors_article,
            rivista_articolo: doc.journal_article,
            url_articolo: doc.url_article,
            classifications: doc.classifications || []
        };
    };

    const fetchComment = async () => {
        if (!apiKey) return;
        setLoading(true);
        setError("");
        setCategory("");

        try {
            let url;
            if (id) {
                url = `https://pubpeerclassifierapi.onrender.com/api/comments/article/${id}`;
            } else {
                url = `https://pubpeerclassifierapi.onrender.com/api/comments/random/1`;
            }

            const res = await fetch(url, { headers: { "x-api-key": apiKey } });
            if (!res.ok) throw new Error(`Loading error: ${res.status}`);
            const data = await res.json();
            const newComment = id ? data : data[0];
            setComment(formatComment(newComment));

            if (!id && newComment) {
                internalNavigation.current = true;
                navigate(`/comment/${newComment.comment_id}`, { replace: true });
            }

        } catch (err) {
            console.error(err);
            setError("Error while loading the comment.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!apiKey) return;
        if (internalNavigation.current) {
            internalNavigation.current = false;
            return;
        }
        fetchComment();
    }, [apiKey, id]);

    const handleClassify = async () => {
        if (!category || !comment?.comment_id) {
            alert("Select a category before submitting.");
            return;
        }

        const payload = {
            category,
            user: userNickname
        };

        setIsSubmitting(true);
        try {
            const res = await fetch(
                `https://pubpeerclassifierapi.onrender.com/api/comments/classify/${comment.comment_id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": apiKey
                    },
                    body: JSON.stringify(payload)
                }
            );
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `Server error ${res.status}`);
            }

            fetchNextComment();
        } catch (err) {
            console.error(err);
            alert(`Error: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchNextComment = async () => {
        if (!apiKey) return;
        setLoading(true);
        setError("");
        setCategory("");

        try {
            const res = await fetch(
                "https://pubpeerclassifierapi.onrender.com/api/comments/random/1",
                { headers: { "x-api-key": apiKey } }
            );
            if (!res.ok) throw new Error(`Loading error: ${res.status}`);
            const data = await res.json();
            const nextComment = data[0];
            if (nextComment) {
                const formatted = formatComment(nextComment);
                setComment(formatted);
                navigate(`/comment/${formatted.comment_id}`, { replace: false });
            }
        } catch (err) {
            console.error(err);
            setError("Error while loading the next comment.");
        } finally {
            setLoading(false);
        }
    };

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    return (
        <div className="comment-page-container">
            <div className="blob b-light-1"></div>
            <div className="blob b-light-2"></div>
            <div className="blob b-light-3"></div>

            <div className="comment-main-card" onClick={() => setIsUserMenuOpen(false)}>
                {loading ? (
                    <div className="status-msg">
                        <div className="spinner"></div>
                        <p>Searching for a comment...</p>
                    </div>
                ) : error ? (
                    <div className="status-msg error">
                        <p>{error}</p>
                        <button onClick={fetchComment} className="retry-btn">
                            Retry
                        </button>
                    </div>
                ) : comment ? (
                    <>
                        <div className="card-header">
                            <div className="header-top">
                                <div className="badge main-badge">PubPeer Analysis</div>
                                <div
                                    className={`badge author-badge ${comment.is_from_author ? "is-author" : "is-peer"}`}
                                >
                                    {comment.is_from_author ? "🖋️ Author" : "🔍 User (Not Author)"}
                                </div>
                            </div>
                            <h2>Classify the comment</h2>
                        </div>

                        <div
                            className={`comment-content-box ${comment.is_from_author ? "author-style" : ""}`}
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(comment.comment_content, {
                                    ADD_ATTR: ["target"]
                                })
                            }}
                        />

                        <div className="article-meta">
                            <p>
                                <strong>Title:</strong>{" "}
                                <a href={comment.url_articolo} target="_blank" rel="noopener noreferrer">
                                    {comment.titolo_articolo}
                                </a>
                            </p>
                            <p>
                                <strong>Authors:</strong> {comment.autori_articolo}
                            </p>
                            <p>
                                <strong>Journal:</strong> {comment.rivista_articolo}
                            </p>
                            <p>
                                <strong>DOI:</strong>{" "}
                                <a
                                    href={`https://doi.org/${comment.DOI}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {comment.DOI}
                                </a>{" "}
                                |{" "}
                                <a
                                    href={`https://pubpeer.com/search?q=${comment.DOI}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    PubPeer
                                </a>
                            </p>
                        </div>

                        <div className="classification-area">
                            <label>Choose the most appropriate category:</label>
                            <div className="category-grid">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        className={`category-btn ${category === cat ? "active" : ""}`}
                                        onClick={() => setCategory(cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            <div className="action-buttons">
                                <button
                                    className="next-btn"
                                    onClick={fetchNextComment}
                                    disabled={issubmitting}
                                >
                                    Skip / Next
                                </button>
                                <button
                                    className="submit-classification"
                                    disabled={!category || issubmitting}
                                    onClick={handleClassify}
                                >
                                    {issubmitting ? "Submitting..." : "Confirm and Submit"}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <p>No comment found.</p>
                )}
            </div>
        </div>
    );
}
