import React, { useState } from "react";
import { TEXTS } from "../assets/locales/texts.js";
import ErrorIcon from "./../assets/images/error_icon.svg";
import "./NewPasswordPopup.css";

export default function NewPasswordPupup({ onClose }) {
  const [platform, setPlatform] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes hacer lo que quieras con el texto y la contraseña
    console.log("Texto:", platform);
    console.log("Contraseña:", password);

    // Cerrar el popup
    onClose();
  };

  const handleCancel = (e) => {
    e.preventDefault();
    // Cerrar el popup
    onClose();
  };

  return (
    <div className="popup-overlay">
      <form className="popup-content" onSubmit={handleSubmit}>
        <h2>{TEXTS.enterNewKey.en}</h2>
        <input
          type="text"
          placeholder={TEXTS.platform.en}
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={TEXTS.password.en}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errorMessage != "" && (
          <div className="error-container">
            <img src={ErrorIcon} className="error-icon" alt="Error icon" />
            <span className="error-message">{errorMessage}</span>
          </div>
        )}
        <div className="new-block-button-group">
          <button type="submit">{TEXTS.save.en}</button>
          <button onClick={handleCancel}>{TEXTS.cancel.en}</button>
        </div>
      </form>
    </div>
  );
}
