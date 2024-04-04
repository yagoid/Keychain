import React, { useState } from "react";
import { TEXTS } from "../assets/locales/texts.js";
import "./ManageAccess.css";

export default function ManageAccess() {
  const [privateKey, setPrivateKey] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí puedes realizar la lógica de autenticación, por ejemplo, enviar los datos a un servidor
    console.log("PrivateKey:", privateKey);
    // También podrías redirigir al usuario a otra página si el inicio de sesión es exitoso
  };

  return (
    <div className="manage-access-section">
      <h1>{TEXTS.managePasswords.en}</h1>
      <div className="input-section">
        <h2>{TEXTS.accessWith.en}</h2>
        <h3 className="input-heading">{TEXTS.privateKey.en}</h3>
        <div className="input-group-private-key">
          <input
            type="password"
            placeholder={TEXTS.privateKey.en}
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <button type="submit" className="access-btn">
          {TEXTS.enter.en}
        </button>
      </div>
    </div>
  );
}
