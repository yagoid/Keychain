import React, { useState } from "react";
import { changePrivateKeyState } from "../../../services/firebase/database.js";
import { useAuth } from "../../../contexts/authContext/index.jsx";
import { TEXTS } from "../../../assets/locales/texts.js";
import InfoIcon from "./../../../assets/images/info_icon.svg";
import ErrorIcon from "./../../../assets/images/error_icon.svg";
import visibleIcon from "./../../../assets/images/visible_icon.svg";
import notVisibleIcon from "./../../../assets/images/not_visible_icon.svg";
import "./CreatePrivateKey.css";

export default function CreatePrivateKey({ onClose, setIsPrivateKeyValid }) {
  const { currentUser } = useAuth();

  const [privateKey, setPrivateKey] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleCreatePrivateKey = async (e) => {
    e.preventDefault();

    if (!isSaving) {
      setIsSaving(true);

      changePrivateKeyState(currentUser.uid)
        .then(() => {
          console.log("Estado cambiado");
          // Guardar la clave privada en sessionStorage
          sessionStorage.setItem("privateKey", privateKey);
          setIsPrivateKeyValid(true);
        })
        .catch((error) => {
          // Manejar cualquier error de registro de username
          console.log("Error al guardar el estado:", error);
          setIsSaving(false);
        });
    }

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
        <div className="show-password-container">
          <input
            type={showPrivateKey ? "text" : "password"}
            placeholder={TEXTS.privateKey.en}
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            required
          />
          <img
            src={!showPrivateKey ? visibleIcon : notVisibleIcon}
            onClick={() => setShowPrivateKey(!showPrivateKey)}
            className="eye_icon"
            alt={!showPrivateKey ? "Eye visible icon" : "Eye not visible icon"}
          />
        </div>
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
