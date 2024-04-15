import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { doSignInWithEmailAndPassword } from "../services/firebase/auth";
import { useAuth } from "./../contexts/authContext";
import { TEXTS } from "./../assets/locales/texts.js";
import KeychainIcon from "./../assets/images/keychain.svg";
import "./Login.css";

export default function LoginPage() {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Email:", email);
    console.log("Password:", password);

    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
        // El inicio de sesión fue exitoso, haz lo que necesites aquí, como redireccionar a otra página
      } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante el inicio de sesión
        console.log("Error al iniciar sesión:", error);
      }
    }
  };

  return (
    <div>
      {userLoggedIn && <Navigate to={"../home"} replace={true} />}
      <Link to="/">
        <img className="login-logo" src={KeychainIcon} alt="Keychain logo" />
      </Link>
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-heading">
            <h2>{TEXTS.log.en}</h2>
            <h2>{TEXTS.in.en}</h2>
          </div>
          <h3 className="input-heading">{TEXTS.email.en}</h3>
          <div className="input-group">
            <input
              type="email"
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
          <button type="submit" className="login-btn">
            {/* <Link to="/home">Ir al home</Link> */}
            {TEXTS.signIn.en}
          </button>
          <div className="question-create-account">
            <p className="question">{TEXTS.questionCreateAccount.en}</p>
            <Link to="/signup" className="crete-account">
              {TEXTS.createAccount.en}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
