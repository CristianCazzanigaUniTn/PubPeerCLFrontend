import { useState } from "react";
import "../styles/ApiKeyPrompt.css";

export default function ApiKeyPrompt({ onLogin }) {
  const [key, setKey] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nickname.trim().length < 2) {
      setError("Enter a valid nickname.");
      return;
    }

    if (key === process.env.REACT_APP_API_KEY) {
      onLogin(key, nickname);
    } else {
      setError("Invalid key. Try again.");
    }
  };

  return (
    <div className="apikey-container light-theme">
      <div className="blob b-light-1"></div>
      <div className="blob b-light-2"></div>

      <div className="apikey-card">
        <header className="card-header">
          <div className="logo-badge-soft">PPC</div>
          <h2>PubPeer Classifier</h2>
          <p>Enter your credentials to begin</p>
        </header>

        <form onSubmit={handleSubmit} className="apikey-form">
          <div className="input-group">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Your nickname..."
              className="apikey-input"
              required
              autoComplete="username"
              spellCheck="false"
            />
            
            <input
              type="password"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                if (error) setError("");
              }}
              placeholder="Access password..."
              className="apikey-input"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="apikey-button">
            <span>Start Session</span>
            <svg className="arrow-icon" viewBox="0 0 24 24" width="18">
              <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v4h16.353l-6.177 6.177 2.847 2.828 11-11z" fill="currentColor"/>
            </svg>
          </button>
        </form>

        {error && (
          <div className="apikey-error animate-fade-in">
            <small>{error}</small>
          </div>
        )}
      </div>
    </div>
  );  
}
