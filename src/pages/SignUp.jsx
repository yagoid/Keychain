import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { auth } from "../services/firebase/firebase";
import { doCreateUserWithEmailAndPassword } from "../services/firebase/auth";
import { isValidUsername, addNewUsername } from "../services/firebase/database";
import { useAuth } from "./../contexts/authContext";
import { checkPasswordStrength } from "./../utils/passwordSecurity";
import { TEXTS } from "./../assets/locales/texts.js";
import visibleIcon from "./../assets/images/visible_icon.svg";
import notVisibleIcon from "./../assets/images/not_visible_icon.svg";
import "./Login.css";
import "./SignUp.css";

export default function SignUpPage() {
  const { userLoggedIn } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCorrectUsername, setIsCorrectUsername] = useState(false);
  const [isCorrectUsernameMessage, setIsCorrectUsernameMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const checkedPasswordStrength = checkPasswordStrength(password);
    if (checkedPasswordStrength != true) {
      setErrorMessage(checkedPasswordStrength);
      return;
    }

    if (password != repeatPassword) {
      setErrorMessage(TEXTS.repeatPasswordError.en);
      return;
    }

    if (!isRegistering) {
      setIsRegistering(true);

      if (await isValidUsername(username)) {
        doCreateUserWithEmailAndPassword(email, password)
          .then(() => {
            addNewUsername(auth.currentUser.uid, username)
              .then(() => {
                console.log("Username agregado");
              })
              .catch((error) => {
                console.log("Error al guardar el username:", error);
                setIsRegistering(false);
              });
          })
          .catch((error) => {
            setErrorMessage(TEXTS.registerError.en);
            setIsRegistering(false);
          });
      } else {
        setErrorMessage(TEXTS.usernameNotValidError.en);
        setIsRegistering(false);
      }
    }
  };

  const handleUsernameChange = async (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);

    if (newUsername.length === 0) {
      setIsCorrectUsername(false);
      setIsCorrectUsernameMessage("");
      return;
    }

    if (await isValidUsername(newUsername)) {
      setIsCorrectUsername(true);
      setIsCorrectUsernameMessage(TEXTS.usernameValid.en);
    } else {
      setIsCorrectUsername(false);
      setIsCorrectUsernameMessage(TEXTS.usernameNotValidError.en);
    }
  };

  return (
    <div className="auth auth--reverse">
      {userLoggedIn && <Navigate to={"../home"} replace={true} />}

      {/* LEFT — form (because reversed) */}
      <main className="auth__form-wrap">
        <div className="auth__form-coord">// 02 / 02 — ENROLL</div>
        <h1 className="auth__form-title">
          ENROLL
          <span className="auth__form-title-dot auth__form-title-dot--ember" />
        </h1>
        <p className="auth__form-sub">
          Forge your identity. The wallet that holds your encrypted vault is
          generated client-side; we never see it.
        </p>

        <form className="auth__form pb-stack" onSubmit={handleRegister}>
          <div className={`pb-field ${
            username && !isCorrectUsername ? "pb-field--error" : ""
          }`}>
            <label className="pb-field__label">{TEXTS.user.en}</label>
            <input
              type="text"
              placeholder="handle"
              value={username}
              onChange={handleUsernameChange}
              className="pb-input"
              required
            />
            <span className="pb-field__scar" />
            {isCorrectUsernameMessage && (
              <span
                className={`signup__hint ${
                  isCorrectUsername ? "signup__hint--ok" : "signup__hint--bad"
                }`}
              >
                {isCorrectUsername ? "✓" : "✕"} {isCorrectUsernameMessage}
              </span>
            )}
          </div>

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

          <div className="pb-field">
            <label className="pb-field__label">{TEXTS.repeatPassword.en}</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className="pb-input"
              required
            />
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
              {isRegistering ? "ENROLLING…" : TEXTS.signUp.en.toUpperCase()}
            </span>
            <span className="main-btn__arrow">→</span>
          </button>

          <div className="auth__alt">
            <span className="auth__alt-q">{TEXTS.questionAlreadyHaveAccount.en}</span>
            <Link to="/login" className="auth__alt-link">
              {TEXTS.logIn.en} <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <p className="signup__legal">
            {TEXTS.privacyPolicySignup.en}{" "}
            <Link
              to="https://disco-holly-d3f.notion.site/Pol-tica-de-privacidad-d0029853470a410695e0f871652cf316?pvs=4"
              target="_blank"
              rel="noreferrer"
              className="signup__legal-link"
            >
              {TEXTS.privacyPolicy.en}
            </Link>
          </p>
        </form>

        <div className="auth__form-foot">
          <span>// BEGIN_ENROLLMENT_FRAME</span>
          <span>{new Date().toISOString().slice(0, 10).replace(/-/g, ".")}</span>
        </div>
      </main>

      {/* RIGHT — brand */}
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

        <div className="auth__brand-coord">// SESSION_AUTH :: 0x02</div>

        <div className="auth__brand-stack">
          <span className="auth__giant">
            {TEXTS.welcome.en}<br />
            <em>{TEXTS.keychain.en}</em>
          </span>
        </div>

        <div className="signup__bullets">
          <div className="signup__bullet">
            <span className="signup__bullet-num">01</span>
            <span className="signup__bullet-text">Client-side AES-256 encryption.</span>
          </div>
          <div className="signup__bullet">
            <span className="signup__bullet-num">02</span>
            <span className="signup__bullet-text">Anchored to a private blockchain ledger.</span>
          </div>
          <div className="signup__bullet">
            <span className="signup__bullet-num">03</span>
            <span className="signup__bullet-text">Your private key never leaves your device.</span>
          </div>
        </div>

        <div className="auth__brand-foot">
          <span className="auth__brand-foot-row">
            <span className="auth__pulse" />
            <span>READY TO MINT</span>
          </span>
          <span className="auth__brand-foot-mono">PoW · AES-256</span>
        </div>

        <div className="auth__orb auth__orb--mirror" aria-hidden="true">
          <span className="auth__orb-core" />
          <span className="auth__orb-ring" />
          <span className="auth__orb-ring auth__orb-ring--2" />
        </div>
      </aside>
    </div>
  );
}
