import React, { useState, useEffect } from "react";
import {
  changePrivateKeyState,
  getUsername,
} from "../../../services/firebase/database.js";
import { useAuth } from "../../../contexts/authContext/index.jsx";
import { usePost } from "./../../../hooks/usePost";
import { TEXTS } from "../../../assets/locales/texts.js";
import {
  encryptMessage,
  decryptMessage,
  generateDerivedKey,
  hashWithSHA3,
} from "../../../utils/crypto";
import CryptoJS from "crypto-js";
import InfoIcon from "./../../../assets/images/info_icon.svg";
import ErrorIcon from "./../../../assets/images/error_icon.svg";
import visibleIcon from "./../../../assets/images/visible_icon.svg";
import notVisibleIcon from "./../../../assets/images/not_visible_icon.svg";
import "./CreatePrivateKey.css";

export default function CreatePrivateKey({ onClose, setIsPrivateKeyValid }) {
  const { currentUser } = useAuth();
  const { postResponse, postLoading, postError, postData } = usePost();

  const [privateKey, setPrivateKey] = useState("");
  const [username, setUsername] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Consultar el nombre de usuario
  useEffect(() => {
    getUsername(currentUser.uid)
      .then((name) => {
        // Guardar el username
        setUsername(name);
      })
      .catch((error) => {
        // Manejar cualquier error de consulta
        console.log("Error al consultar el nombre de usuario", error);
      });
  }, []);

  const handleCreatePrivateKey = async (e) => {
    e.preventDefault();

    if (!isSaving) {
      setIsSaving(true);

      changePrivateKeyState(currentUser.uid, true)
        .then(() => {
          console.log("Estado cambiado");
          // Añadir el nuevo usuario a la blockchain
          addUserInBlockchian();
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

  const addUserInBlockchian = async () => {
    // Cifrar los datos antes de enviarlos
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const kdfPrivateKey = generateDerivedKey(privateKey, salt);
    const hashUsername = hashWithSHA3(username);
    const hashUidUser = hashWithSHA3(currentUser.uid);

    const encryptedMessage = encryptMessage(hashUsername, kdfPrivateKey, iv);
    // const encryptedHex = CryptoJS.enc.Base64.parse(encryptedMessage.toString());

    // console.log("KDF: ", kdfPrivateKey);
    // console.log("Encriptado: ", encryptedMessage);

    // Enviar los datos a la blockchain
    try {
      postData("add_user", {
        uid_user: hashUidUser,
        encrypted_data: encryptedMessage.toString(),
        salt: salt.toString()
      });
      // Guardar la clave privada en sessionStorage
      sessionStorage.setItem("privateKey", privateKey);
      setIsPrivateKeyValid(true);
    } catch (error) {
      console.log("Error al enviar datos a la blockchian", error);

      changePrivateKeyState(currentUser.uid, false)
        .then(() => {
          console.log("Estado de private key revertido");
        })
        .catch((error) => {
          // Manejar cualquier error de registro de username
          console.log("Error al guardar el estado:", error);
          setIsSaving(false);
        });
    }
  };

  return (
    <div className="popup-overlay">
      <form className="popup-content-privatekey" onSubmit={handleCreatePrivateKey}>
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
