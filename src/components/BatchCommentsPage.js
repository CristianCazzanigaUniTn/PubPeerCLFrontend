import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BatchCommentsPage.css";

export default function BatchCommentsPage({ apiKey }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchBatch = async () => {
    if (!apiKey) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        "https://pubpeerclassifierapi.onrender.com/api/comments/random/25",
        { headers: { "x-api-key": apiKey } }
      );
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
      setError("Error while loading comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBatch(); }, [apiKey]);

  return (
    <div className="batch-container">
      {/* BACKGROUND ELEMENTS - Always present */}
      <div className="blob b-light-1"></div>
      <div className="blob b-light-2"></div>
      <div className="blob b-light-3"></div>

      <div className="batch-content-wrapper">
        <div className="batch-header">
          <h2>Explore <span style={{ fontWeight: 400 }}>Comments</span></h2>
          <button 
            onClick={fetchBatch} 
            className="refresh-btn"
            disabled={loading}
          >
            {loading ? "..." : "Refresh List"}
          </button>
        </div>

        {loading ? (
          <div className="status-container">
            <div className="spinner"></div>
            <p>Generating new comments...</p>
          </div>
        ) : error ? (
          <div className="status-container">
            <p className="error-msg">{error}</p>
            <button onClick={fetchBatch} className="category-btn">Retry</button>
          </div>
        ) : (
          <div className="batch-grid">
            {comments.map((c) => (
              <div
                key={c.comment_id}
                className="batch-card"
                onClick={() => navigate(`/comment/${c.comment_id}`)}
              >
                <div className="batch-card-top">
                  <span className="doi-badge">DOI</span>
                  <span className="doi-text">{c.doi_article.split('/').pop()}</span>
                </div>
                <p className="title">{c.title_article || "Title not available"}</p>
                <div className="batch-card-footer">
                  Classify now <span>→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
