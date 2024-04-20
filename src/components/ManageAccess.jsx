import React, { useState, useEffect } from "react";
import { privateKeyExists } from "../services/firebase/database";
import { useAuth } from "./../contexts/authContext";
import { TEXTS } from "../assets/locales/texts.js";
import CreatePrivateKey from "./CreatePrivateKey.jsx";
import visibleIcon from "./../assets/images/visible_icon.svg";
import notVisibleIcon from "./../assets/images/not_visible_icon.svg";
import "./ManageAccess.css";

export default function ManageAccess({ setIsPrivateKeyValid }) {
  const { currentUser } = useAuth();

  const [privateKey, setPrivateKey] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isOpenNewPasswordPopup, setIsOpenNewPasswordPopup] = useState(false);

  const handleKeyVerify = (e) => {
    e.preventDefault();
    // Aquí puedes realizar la lógica de autenticación, por ejemplo, enviar los datos a un servidor
    console.log("PrivateKey:", privateKey);

    // Guardar la clave privada en sessionStorage
    sessionStorage.setItem("privateKey", privateKey);
    setIsPrivateKeyValid(true);
  };

  const handleClosePopup = () => {
    setIsOpenNewPasswordPopup(false);
  };

  // Comprobar si el usuario tiene registrada una clave privada
  useEffect(() => {
    privateKeyExists(currentUser.uid)
      .then((exists) => {
        if (!exists) {
          // Abrir el popup de crear una nueva clave privada
          setIsOpenNewPasswordPopup(true);
        } else {
          // Verificar si hay una clave privada guardada en sessionStorage al cargar el componente
          const storedPrivateKey = sessionStorage.getItem("privateKey");
          if (storedPrivateKey) {
            setPrivateKey(storedPrivateKey);
          }
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
      <form className="input-section" onSubmit={handleKeyVerify}>
        <h2>{TEXTS.accessWith.en}</h2>
        <h3 className="input-heading">{TEXTS.privateKey.en}</h3>
        <div className="input-group-private-key">
          <input
            type={showPrivateKey ? "text" : "password"}
            placeholder={TEXTS.privateKey.en}
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            className="input-field"
            required
          />
          <img
            src={!showPrivateKey ? visibleIcon : notVisibleIcon}
            onClick={() => setShowPrivateKey(!showPrivateKey)}
            className="eye_icon"
            alt={!showPrivateKey ? "Eye visible icon" : "Eye not visible icon"}
          />
        </div>
        <button type="submit" className="access-btn">
          {TEXTS.enter.en}
        </button>
      </form>
      {isOpenNewPasswordPopup && (
        <CreatePrivateKey
          onClose={handleClosePopup}
          setIsPrivateKeyValid={setIsPrivateKeyValid}
        />
      )}
    </div>
  );
}
