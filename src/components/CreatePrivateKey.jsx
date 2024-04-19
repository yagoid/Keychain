import React, { useState } from "react";
import { TEXTS } from "../assets/locales/texts.js";
import InfoIcon from "./../assets/images/info_icon.svg";
import ErrorIcon from "./../assets/images/error_icon.svg";
import "./CreatePrivateKey.css";

export default function CreatePrivateKey({ onClose }) {
  const [privateKey, setPrivateKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreatePrivateKey = (e) => {
    e.preventDefault();
    // Aquí puedes hacer lo que quieras con el texto y la contraseña
    console.log("Contraseña:", privateKey);

    // Cerrar el popup
    onClose();
  };

  return (
    <div className="popup-overlay">
      <form
        className="popup-content-privatekey"
        onSubmit={handleCreatePrivateKey}
      >
        <h2>{TEXTS.createPrivateKey.en}</h2>
        <input
          type="password"
          placeholder={TEXTS.privateKey.en}
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          required
        />
        <div className="info-container">
          <img src={InfoIcon} className="info-icon" alt="Info icon" />
          <span className="info-message">{TEXTS.createPrivateKeyInfo.en}</span>
        </div>
        {errorMessage != "" && (
          <div className="error-container">
            <img src={ErrorIcon} className="error-icon" alt="Error icon" />
            <span className="error-message">{errorMessage}</span>
          </div>
        )}
        <div className="new-block-button-group">
          <button type="submit">{TEXTS.save.en}</button>
        </div>
      </form>
    </div>
  );
}
