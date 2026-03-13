import { useState, useEffect, useRef } from "react";
import "../styles/login.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [lang, setLang] = useState("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [labels, setLabels] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchTranslations(lang);
  }, [lang]);

  // Close hamburger menu if clicking outside anywhere
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchTranslations(langCode) {
    try {
      const res = await fetch(`/api/auth/translations/${langCode}`);
      const data = await res.json();
      setLabels(data);
    } catch (err) {
      console.error("Translation fetch failed", err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        onLogin();
      } else {
        setError(labels.login_error || "Wrong username or password");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="login-page"
      style={{
        backgroundImage:
          "url('https://storage.123fakturera.se/public/wallpapers/sverige43.jpg')",
      }}
    >
      
      <div className="login-topbar">
        {/* Hamburger and dropdown logic */}
        <div ref={menuRef}>
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {menuOpen && (
            <div className="hamburger-menu">
              <a href="#">{labels.menu_home || "Home"}</a>
              <a href="#">{labels.menu_about || "About"}</a>
              <a href="#">{labels.menu_pricing || "Pricing"}</a>
              <a href="#">{labels.menu_contact || "Contact"}</a>
              <a href="#">{labels.menu_register || "Register"}</a>
            </div>
          )}
        </div>

        {/* switch flags according to option selected */}
        <div className="lang-switcher">
          <img
            src="https://storage.123fakturere.no/public/flags/SE.png"
            alt="Swedish"
            onClick={() => {
              setLang("sv");
              setError("");
            }}
            className={`flag ${lang === "sv" ? "active" : ""}`}
          />
          <img
            src="https://storage.123fakturere.no/public/flags/GB.png"
            alt="English"
            onClick={() => {
              setLang("en");
              setError("");
            }}
            className={`flag ${lang === "en" ? "active" : ""}`}
          />
        </div>
      </div>

   
      <div className="login-card">
        <a href="https://online.123fakturera.se/">
          <img
            src="https://storage.123fakturera.se/public/icons/diamond.png"
            alt="Logo"
            className="login-logo"
          />
        </a>

        <h2>{labels.login_title || "Login"}</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="input-group">
            <input
              type="text"
              placeholder={labels.username || "Username"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          {/* Password with show/hide icon */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={labels.password || "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                /* Eye-off icon */
                <svg className="eye-icon" viewBox="0 0 24 24">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                /* Eye icon */
                <svg className="eye-icon" viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {/* Error */}
          {error && <p className="error-msg">{error}</p>}

          {/* Submit button */}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "..." : labels.login_btn || "Log In"}
          </button>
        </form>

        <a href="#" className="forgot-link">
          {labels.forgot_password || "Forgot password?"}
        </a>
      </div>
    </div>
  );
}
