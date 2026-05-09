import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { doSignInWithEmailAndPassword } from "../services/firebase/auth";
import { useAuth } from "./../contexts/authContext";
import { TEXTS } from "./../assets/locales/texts.js";
import visibleIcon from "./../assets/images/visible_icon.svg";
import notVisibleIcon from "./../assets/images/not_visible_icon.svg";
import "./Login.css";

export default function LoginPage() {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
      } catch (error) {
        if (error.code === "auth/invalid-credential") {
          setErrorMessage(TEXTS.credentialsError.en);
        } else {
          setErrorMessage(TEXTS.loginError.en);
        }
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div className="auth">
      {userLoggedIn && <Navigate to={"../home"} replace={true} />}

      {/* LEFT — brand panel */}
      <aside className="auth__brand">
        <Link to="/" className="auth__home" aria-label="Home">
          <svg className="auth__home-svg" width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect x="2.5" y="9.5" width="11" height="11" rx="1" stroke="currentColor" strokeWidth="1.4" />
            <rect x="10.5" y="5.5" width="11" height="11" rx="1" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
            <rect x="18.5" y="13.5" width="11" height="11" rx="1" stroke="var(--plasma)" strokeWidth="1.4" />
            <line x1="8" y1="15" x2="13" y2="15" stroke="var(--plasma)" strokeWidth="1.2" />
            <line x1="16" y1="11" x2="21" y2="11" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
            <circle cx="24" cy="19" r="1.4" fill="var(--plasma)" />
          </svg>
          <span className="auth__home-word">KEY<span className="auth__home-sep">/</span>CHAIN</span>
        </Link>

        <div className="auth__brand-coord">// SESSION_AUTH :: 0x01</div>

        <div className="auth__brand-stack">
          <span className="auth__giant">ENTER<br/>THE<br/><em>VAULT</em></span>
        </div>

        <pre className="auth__ascii" aria-hidden="true">{`
  ┌──────┐
  │ 0x01 │──┐
  └──────┘  │
            ▼
        ┌──────┐
        │ 0x02 │──┐
        └──────┘  │
                  ▼
              ┌──────┐
              │ 0x03 │
              └──────┘
`}</pre>

        <div className="auth__brand-foot">
          <span className="auth__brand-foot-row">
            <span className="auth__pulse" />
            <span>CHAIN ONLINE</span>
            <span className="auth__brand-foot-sep">·</span>
            <span className="auth__brand-foot-mono">PoW · AES-256</span>
          </span>
        </div>

        <div className="auth__orb" aria-hidden="true">
          <span className="auth__orb-core" />
          <span className="auth__orb-ring" />
          <span className="auth__orb-ring auth__orb-ring--2" />
        </div>
      </aside>

      {/* RIGHT — form */}
      <main className="auth__form-wrap">
        <div className="auth__form-coord">// 01 / 02 — AUTHENTICATE</div>
        <h1 className="auth__form-title">
          LOG <span className="auth__form-title-accent">IN</span>
          <span className="auth__form-title-dot" />
        </h1>
        <p className="auth__form-sub">
          Access your encrypted vault. Credentials are <span className="pb-mono">never</span> stored
          unhashed.
        </p>

        <form className="auth__form pb-stack" onSubmit={handleLogin}>
          <div className="pb-field">
            <label className="pb-field__label">{TEXTS.email.en}</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pb-input"
              required
            />
            <span className="pb-field__scar" />
          </div>

          <div className="pb-field">
            <label className="pb-field__label">{TEXTS.password.en}</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pb-input"
              required
            />
            <button
              type="button"
              className="pb-field__icon"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <img
                src={!showPassword ? visibleIcon : notVisibleIcon}
                alt=""
                style={{ width: 22, height: 22, filter: "invert(0.85)" }}
              />
            </button>
            <span className="pb-field__scar" />
          </div>

          {errorMessage && (
            <div className="pb-error">
              <span className="pb-error__bar" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button type="submit" className="main-btn main-btn--plasma auth__submit">
            <span className="main-btn__text">
              {isSigningIn ? "AUTHENTICATING…" : TEXTS.signIn.en.toUpperCase()}
            </span>
            <span className="main-btn__arrow">→</span>
          </button>

          <div className="auth__alt">
            <span className="auth__alt-q">{TEXTS.questionCreateAccount.en}</span>
            <Link to="/signup" className="auth__alt-link">
              {TEXTS.createAccount.en} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </form>

        <div className="auth__form-foot">
          <span>// END_SESSION_FRAME</span>
          <span>{new Date().toISOString().slice(0, 10).replace(/-/g, ".")}</span>
        </div>
      </main>
    </div>
  );
}
