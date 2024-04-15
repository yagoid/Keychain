import React, { useState } from "react";
import { TEXTS } from "./../assets/locales/texts.js";
import KeychainIcon from "./../assets/images/keychain.svg";
import hexagons2 from "./../assets/images/hexagons2.svg";
import "./Login.css";
import "./SignUp.css";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Repeat Password:", repeatPassword);
  };

  return (
    <div>
      <a href="/">
        <img className="login-logo" src={KeychainIcon} alt="Keychain logo" />
      </a>
      <div className="signup-page">
        <div className="signup-container">
          <form className="login-form sign-form" onSubmit={handleLogin}>
            <div className="signup-heading">
              <h2>{TEXTS.createAccount.enUpperCase}</h2>
            </div>

            <h3 className="input-heading">{TEXTS.user.en}</h3>
            <div className="input-group">
              <input
                type="text"
                placeholder={TEXTS.user.en}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <h3 className="input-heading">{TEXTS.email.en}</h3>
            <div className="input-group">
              <input
                type="text"
                placeholder={TEXTS.email.en}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <h3 className="input-heading">{TEXTS.password.en}</h3>
            <div className="input-group">
              <input
                type="password"
                placeholder={TEXTS.password.en}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <h3 className="input-heading">{TEXTS.repeatPassword.en}</h3>
            <div className="input-group">
              <input
                type="password"
                placeholder={TEXTS.repeatPassword.en}
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <button type="submit" className="login-btn">
              {TEXTS.signUp.en}
            </button>
            <div className="question-create-account">
              <p className="question">{TEXTS.questionAlreadyHaveAccount.en}</p>
              <a href="/login" className="crete-account">
                {TEXTS.logIn.en}
              </a>
            </div>
          </form>
        </div>
        <img
          src={hexagons2}
          className="hexagons2-background"
          alt="Background of hexagons"
        />
        <div className="welcome-text">
          <span>{TEXTS.welcome.en}</span>
          <span> {TEXTS.keychain.en}</span>
        </div>
      </div>
    </div>
  );
}
