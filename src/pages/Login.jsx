import React, { useState } from "react";
import { TEXTS } from "./../assets/locales/texts.js";
import "./Login.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí puedes realizar la lógica de autenticación, por ejemplo, enviar los datos a un servidor
    console.log("Username:", username);
    console.log("Password:", password);
    // También podrías redirigir al usuario a otra página si el inicio de sesión es exitoso
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <div className="login-heading">
          <h2>{TEXTS.log.en}</h2>
          <h2>{TEXTS.in.en}</h2>
        </div>
        <h3 className="user-heading">{TEXTS.user.en}</h3>
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
        <h3 className="password-heading">{TEXTS.password.en}</h3>
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
          {TEXTS.signIn.en}
        </button>
        <p className="question">{TEXTS.createAccount.en}</p>
      </form>
    </div>
  );
}
