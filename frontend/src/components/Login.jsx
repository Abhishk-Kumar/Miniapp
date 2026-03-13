import { useState, useEffect, useRef } from "react";
import "../styles/login.css";


const SWEDISH_FLAG = "https://storage.123fakturere.no/public/flags/SE.png";
const ENGLISH_FLAG = "https://storage.123fakturere.no/public/flags/GB.png";
const LOGO_URL = "https://storage.123fakturera.se/public/icons/diamond.png";

export default function Login({ onLogin }) {


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 
  const [currentLang, setCurrentLang] = useState("sv");


  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const [translations, setTranslations] = useState({});

  const langDropdownRef = useRef(null);

  // Fetch translations whenever language changes
  useEffect(() => {
    fetchTranslations(currentLang);
  }, [currentLang]);

  // Close language dropdown when clicking outside of it
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

  // Fetch translations from backend by language code (en or sv)
  async function fetchTranslations(langCode) {
    try {
      const response = await fetch(`/api/auth/translations/${langCode}`);
      const data = await response.json();
      setTranslations(data);
    } catch (err) {
      console.error("Failed to fetch translations:", err);
    }
  }

  // Switch language and close the dropdown
  function handleLanguageSwitch(langCode) {
    setCurrentLang(langCode);
    setLangDropdownOpen(false);
    setError("");
  }

  // Handle login form submission
  async function handleLoginSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save JWT token and redirect to price list
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

  // get translation from DB, fallback for failed query
  function getText(translationKey, swedishFallback, englishFallback) {
    return (
      translations[translationKey] ||
      (currentLang === "sv" ? swedishFallback : englishFallback)
    );
  }

  return (
    <div className="login-container">
         {/* bg image  */}
      <div className="background-container" />

      
      <div
        className={`drawer-overlay ${mobileDrawerOpen ? "visible" : ""}`}
        onClick={() => setMobileDrawerOpen(false)}
      />

    
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

     
          {/* TOP NAVIGATION BAR */}
        
      <nav className="navigation-out">

        {/* Logo */}
        <div className="nav-logo">
          <img src={LOGO_URL} alt="123 Fakturera Logo" />
        </div>

        {/* Hamburger button — for mobile only */}
        <button
          className="hamburger-btn"
          onClick={() => setMobileDrawerOpen(true)}
          aria-label="Open menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation links*/}
        <ul className="nav-links">
          <li><a href="#">{getText("menu_home", "Hem", "Home")}</a></li>
          <li><a href="#">{getText("menu_order", "Beställ", "Order")}</a></li>
          <li><a href="#">{getText("menu_customers", "Våra Kunder", "Our Customers")}</a></li>
          <li><a href="#">{getText("menu_about", "Om oss", "About us")}</a></li>
          <li><a href="#">{getText("menu_contact", "Kontakta oss", "Contact Us")}</a></li>
        </ul>

        {/* Language dropdown  */}
        <div className="lang-dropdown-wrapper" ref={langDropdownRef}>

          {/* Current language button */}
          <button
            className="lang-dropdown-btn"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
          >
            <span>
              {currentLang === "sv" ? "Svenska" : "English"}
            </span>
            <img
              src={currentLang === "sv" ? SWEDISH_FLAG : ENGLISH_FLAG}
              alt={currentLang === "sv" ? "Swedish flag" : "English flag"}
            />
            <span className="arrow">▾</span>
          </button>

          {/* Dropdown options : to switch language */}
          {langDropdownOpen && (
            <div className="lang-dropdown-menu">
              <button
                className="lang-option"
                onClick={() => handleLanguageSwitch("sv")}
              >
                <img src={SWEDISH_FLAG} alt="Swedish flag" />
                <span>Svenska</span>
              </button>
              <button
                className="lang-option"
                onClick={() => handleLanguageSwitch("en")}
              >
                <img src={ENGLISH_FLAG} alt="English flag" />
                <span>English</span>
              </button>
            </div>
          )}
        </div>
      </nav>

     {/* login card  */}
      <div className="content">
        <div className="login-content-root">

          {/* Title */}
          <h2 className="login-title">
            {getText("login_title", "Logga in", "Log in")}
          </h2>

          <form onSubmit={handleLoginSubmit}>

            {/* Email field */}
            <label className="field-label">
              {getText("email_label", "Skriv in din epost adress", "Enter your email address")}
            </label>
            <input
              type="email"
              className="login-input"
              placeholder={getText("email_placeholder", "Epost adress", "Email address")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            {/* Password field */}
            <label className="field-label">
              {getText("password_label", "Skriv in ditt lösenord", "Enter your password")}
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

              {/* toggles password visibility logic */}
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  /* password is visible */
                  <svg className="eye-icon" viewBox="0 0 24 24">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  /*  password is hidden */
                  <svg className="eye-icon" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Error message : for wrong credentials */}
            {error && <p className="error-msg">{error}</p>}

            {/* Login submit button  */}
            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading
                ? "..."
                : getText("login_btn", "Logga in", "Log in")}
            </button>

            {/* Register btn and Forgot password  */}
            <div className="login-bottom-links">
              <a href="#">
                {getText("register", "Registrera dig", "Register")}
              </a>
              <a href="#">
                {getText("forgot_password", "Glömt lösenord?", "Forgotten password?")}
              </a>
            </div>

          </form>
        </div>
      </div>

      {/* footer logic */}
      <div className="footer">
        <div className="footer-top">
          <span className="footer-brand">
            123 Fakturera
          </span>
          <div className="footer-links">
            <a href="#">{getText("menu_home", "Hem", "Home")}</a>
            <a href="#">{getText("menu_order", "Beställ", "Order")}</a>
            <a href="#">{getText("menu_contact", "Kontakta oss", "Contact us")}</a>
          </div>
        </div>

        {/* White dividing line + copyright */}
        <div className="footer-bottom">
          <span className="footer-copy">
            © Lättfaktura, CRO no. 638537, 2025. All rights reserved.
          </span>
        </div>
      </div>

    </div>
  );
}