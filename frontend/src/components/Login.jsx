import { useState, useEffect, useRef } from "react";
import "../styles/login.css";

const API_BASE = import.meta.env.VITE_API_URL || "";

const SWEDISH_FLAG = "https://storage.123fakturere.no/public/flags/SE.png";
const ENGLISH_FLAG = "https://storage.123fakturere.no/public/flags/GB.png";
const LOGO_URL = "https://storage.123fakturera.se/public/icons/diamond.png";

export default function Login({ onLogin }) {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Language — default Swedish language
  const [currentLang, setCurrentLang] = useState("sv");

  // UI state
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Translations fetched from database
  const [translations, setTranslations] = useState({});

  const langDropdownRef = useRef(null);

  // Fetch translations when language changes
  useEffect(() => {
    fetchTranslations(currentLang);
  }, [currentLang]);

  // Close language dropdown when clicking outside
  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target)
      ) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Fetch translations from DB by language code
  async function fetchTranslations(langCode) {
    try {
      const response = await fetch(
        `${API_BASE}/api/auth/translations/${langCode}`
      );
      const data = await response.json();
      setTranslations(data);
    } catch (err) {
      console.error("Failed to fetch translations:", err);
    }
  }

  // Switch language and close dropdown
  function handleLanguageSwitch(langCode) {
    setCurrentLang(langCode);
    setLangDropdownOpen(false);
    setError("");
  }

  // Login form submit
  async function handleLoginSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        onLogin();
      } else {
        setError(
          translations.login_error ||
            (currentLang === "sv"
              ? "Fel epost eller lösenord"
              : "Wrong email or password")
        );
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Get translation from DB with Swedish/English fallback if db query fails
  function getText(key, swedishFallback, englishFallback) {
    return (
      translations[key] ||
      (currentLang === "sv" ? swedishFallback : englishFallback)
    );
  }

  return (
    <div className="login-container">
      {/* Background image */}
      <div className="background-container" />

      {/* Mobile drawer overlay */}
      <div
        className={`drawer-overlay ${mobileDrawerOpen ? "visible" : ""}`}
        onClick={() => setMobileDrawerOpen(false)}
      />

      {/* Mobile side drawer */}
      <div className={`mobile-drawer ${mobileDrawerOpen ? "open" : ""}`}>
        <button
          className="drawer-close"
          onClick={() => setMobileDrawerOpen(false)}
        >
          ✕
        </button>
        <a href="#" onClick={() => setMobileDrawerOpen(false)}>
          {getText("menu_home", "Hem", "Home")}
        </a>
        <a href="#" onClick={() => setMobileDrawerOpen(false)}>
          {getText("menu_order", "Beställ", "Order")}
        </a>
        <a href="#" onClick={() => setMobileDrawerOpen(false)}>
          {getText("menu_customers", "Våra Kunder", "Our Customers")}
        </a>
        <a href="#" onClick={() => setMobileDrawerOpen(false)}>
          {getText("menu_about", "Om oss", "About us")}
        </a>
        <a href="#" onClick={() => setMobileDrawerOpen(false)}>
          {getText("menu_contact", "Kontakta oss", "Contact Us")}
        </a>
      </div>

      <nav className="navigation-out">
        {/* Logo — desktop only */}
        <div className="nav-logo">
          <img src={LOGO_URL} alt="123 Fakturera Logo" />
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="hamburger-btn"
          onClick={() => setMobileDrawerOpen(true)}
          aria-label="Open menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Nav links  */}
        <ul className="nav-links">
          <li>
            <a href="#">{getText("menu_home", "Hem", "Home")}</a>
          </li>
          <li>
            <a href="#">{getText("menu_order", "Beställ", "Order")}</a>
          </li>
          <li>
            <a href="#">
              {getText("menu_customers", "Våra Kunder", "Our Customers")}
            </a>
          </li>
          <li>
            <a href="#">{getText("menu_about", "Om oss", "About us")}</a>
          </li>
          <li>
            <a href="#">
              {getText("menu_contact", "Kontakta oss", "Contact Us")}
            </a>
          </li>
        </ul>

        {/* Language dropdown */}
        <div className="lang-dropdown-wrapper" ref={langDropdownRef}>
          <button
            className="lang-dropdown-btn"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
          >
            <span>{currentLang === "sv" ? "Svenska" : "English"}</span>
            <img
              src={currentLang === "sv" ? SWEDISH_FLAG : ENGLISH_FLAG}
              alt={currentLang === "sv" ? "Swedish flag" : "English flag"}
            />
            <span className="arrow">▾</span>
          </button>

          {langDropdownOpen && (
            <div className="lang-dropdown-menu">
              <button
                className="lang-option"
                onClick={() => handleLanguageSwitch("sv")}
              >
                <img src={SWEDISH_FLAG} alt="Svenska" />
                <span>Svenska</span>
              </button>
              <button
                className="lang-option"
                onClick={() => handleLanguageSwitch("en")}
              >
                <img src={ENGLISH_FLAG} alt="English" />
                <span>English</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="content">
        <div className="login-content-root">
          <h2 className="login-title">
            {getText("login_title", "Logga in", "Log in")}
          </h2>

          <form onSubmit={handleLoginSubmit}>
            {/* Email */}
            <label className="field-label">
              {getText(
                "email_label",
                "Skriv in din epost adress",
                "Enter your email address"
              )}
            </label>
            <input
              type="email"
              className="login-input"
              placeholder={getText(
                "email_placeholder",
                "Epost adress",
                "Email address"
              )}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            {/* Password */}
            <label className="field-label">
              {getText(
                "password_label",
                "Skriv in ditt lösenord",
                "Enter your password"
              )}
            </label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="login-input"
                placeholder={getText("password", "Lösenord", "Password")}
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
                  <svg className="eye-icon" viewBox="0 0 24 24">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg className="eye-icon" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {/* Error */}
            {error && <p className="error-msg">{error}</p>}

            {/* Login button */}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "..." : getText("login_btn", "Logga in", "Log in")}
            </button>

            {/* Register + Forgot password */}
            <div className="login-bottom-links">
              <a href="#">
                {getText("register", "Registrera dig", "Register")}
              </a>
              <a href="#">
                {getText(
                  "forgot_password",
                  "Glömt lösenord?",
                  "Forgotten password?"
                )}
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="footer">
        <div className="footer-top">
          <span className="footer-brand">123 Fakturera</span>
          <div className="footer-links">
            <a href="#">{getText("menu_home", "Hem", "Home")}</a>
            <a href="#">{getText("menu_order", "Beställ", "Order")}</a>
            <a href="#">
              {getText("menu_contact", "Kontakta oss", "Contact us")}
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">
            © Lättfaktura, CRO no. 638537, 2025. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
}
