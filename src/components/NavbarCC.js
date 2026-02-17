import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar({ userNickname }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); 

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsMenuOpen(false); 
  };

  const confirmLogout = () => {
    localStorage.removeItem("apiKey");
    localStorage.removeItem("nickname");
    window.location.reload();
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/comment" className="navbar-logo">
            PubPeer <span style={{ fontWeight: 400 }}>Classifier</span>
          </Link>
        </div>

        <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
          <Link to="/comment" onClick={() => setIsMenuOpen(false)}>Classify</Link>
          <Link to="/comment-list" onClick={() => setIsMenuOpen(false)}>Explore</Link>
          
          <div className="user-dropdown-container">
            <div className="navbar-user">
              👤 {userNickname}
            </div>

            <div className="user-dropdown-menu">
              <button onClick={handleLogoutClick} className="logout-btn">
                <span>🚪</span> Logout
              </button>
            </div>
          </div>
        </div>

        <div
          className={`navbar-hamburger ${isMenuOpen ? "active" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </nav>

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Are you sure you want to log out?</h3>
            <p>You will need to re-enter your API Key to access again.</p>
            <div className="modal-actions">
              <button onClick={() => setShowLogoutModal(false)} className="btn-cancel">
                No, stay
              </button>
              <button onClick={confirmLogout} className="btn-confirm">
                Yes, log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
