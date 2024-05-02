import React, { useState } from "react";
import {
  addNewPlatform,
  platformExists,
} from "../../../services/firebase/database.js";
import { postData } from "./../../../services/blockchain/api";
import { useAuth } from "../../../contexts/authContext/index";
import { useKey } from "./../../../contexts/keyContext/keyContext";
import {
  decryptMessage,
  encryptMessage,
  hashWithSHA3,
} from "../../../utils/crypto";
import CryptoJS from "crypto-js";
import { TEXTS } from "../../../assets/locales/texts.js";
import ErrorIcon from "./../../../assets/images/error_icon.svg";
import "./NewPasswordPopup.css";

export default function NewPasswordPupup({ onClose, setPlatforms }) {
  const { currentUser } = useAuth();
  const { contextPrivateKey } = useKey();

  const [platform, setPlatform] = useState("");
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSaveBlock = async (e) => {
    e.preventDefault();
    // Se comprueba que la plataforma existe y después se añade a la base de datos
    if (!isSaving) {
      if (!(await platformExists(currentUser.uid, platform))) {
        addNewPlatform(currentUser.uid, platform)
          .then(() => {
            console.log("Contraseña añadida a firebase");
            addPasswordInBlockchian();
          })
          .catch((error) => {
            // Manejar cualquier error de registro de username
            console.log("Error al guardar el nuevo bloque:", error);
            setErrorMessage(TEXTS.errorNewBlock.en);
            setIsSaving(false);
          });
      } else {
        console.log("La plataforma ya existe");
        setErrorMessage(TEXTS.errorPlatformExists.en);
        setIsSaving(false);
      }
    }
  };

  const addPasswordInBlockchian = () => {
    // Verificar si hay una clave privada guardada en sessionStorage
    const storedPrivateKey = sessionStorage.getItem("privateKey");
    if (storedPrivateKey || contextPrivateKey != "") {
      // Cifrar los datos antes de enviarlos
      const iv = CryptoJS.lib.WordArray.random(128 / 8);
      const hashUsername = hashWithSHA3(currentUser.uid);
      const hashPlatform = hashWithSHA3(platform);

      // Encriptar la clave privada para guardarla
      const defaultEncryptionKey = hashWithSHA3(currentUser.uid);

      // Desencriptar la clave privada
      const decryptedPrivateKey = decryptMessage(
        contextPrivateKey,
        defaultEncryptionKey,
        CryptoJS.enc.Hex.parse("iv")
      );

      // Encriptar la contraseña
      const encryptedMessage = encryptMessage(
        password,
        CryptoJS.enc.Hex.parse(decryptedPrivateKey),
        iv
      );

      // Enviar los datos a la blockchain
      postData("add_data", {
        user: hashUsername,
        platform: hashPlatform,
        key: encryptedMessage,
        iv: iv.toString(),
      })
        .then((response) => {
          response.json();
        })
        .then((data) => {
          console.log(data);
          console.log("contraseña creada!");

          // setPlatforms(platform);
          setPlatforms((prevPlatforms) => [...prevPlatforms, platform]);

          // Cerrar el popup
          onClose();
        })
        .catch((error) => {
          console.log("Error al enviar datos a la blockchian", error);
          setErrorMessage(TEXTS.errorCreatePrivateKey.en);
        })
        .finally(() => {
          setIsSaving(false);
        });
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    // Cerrar el popup
    onClose();
  };

  return (
    <div className="popup-overlay">
      <form className="popup-content" onSubmit={handleSaveBlock}>
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
