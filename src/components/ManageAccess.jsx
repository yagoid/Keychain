import React, { useState, useEffect } from "react";
import { privateKeyExists } from "../services/firebase/database";
import { useAuth } from "./../contexts/authContext";
import { TEXTS } from "../assets/locales/texts.js";
import CreatePrivateKey from "./CreatePrivateKey.jsx";
import "./ManageAccess.css";

export default function ManageAccess() {
  const { currentUser } = useAuth();

  const [privateKey, setPrivateKey] = useState("");
  const [isOpenNewPasswordPopup, setIsOpenNewPasswordPopup] = useState(false);

  const handleKeyVerify = (e) => {
    e.preventDefault();
    // Aquí puedes realizar la lógica de autenticación, por ejemplo, enviar los datos a un servidor
    console.log("PrivateKey:", privateKey);
    // También podrías redirigir al usuario a otra página si el inicio de sesión es exitoso
  };

  const handleClosePopup = () => {
    setIsOpenNewPasswordPopup(false);
  };

  useEffect(() => {
    privateKeyExists(currentUser.uid)
      .then((exists) => {
        if (!exists) {
          setIsOpenNewPasswordPopup(true);
        }
      })
      .catch((error) => {
        console.error(
          "Error al verificar la existencia de la clave privada:",
          error
        );
      });
  }, []);

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
      {isOpenNewPasswordPopup && (
        <CreatePrivateKey onClose={handleClosePopup} />
      )}
    </div>
  );
}
