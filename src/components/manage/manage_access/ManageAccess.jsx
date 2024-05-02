import React, { useState, useEffect } from "react";
import {
  privateKeyExists,
  getUsername,
} from "./../../../services/firebase/database.js";
import { useAuth } from "./../../../contexts/authContext/index";
import { useKey } from "./../../../contexts/keyContext/keyContext";
import { fetchData } from "./../../../services/blockchain/api";
import {
  encryptMessage,
  generateDerivedKey,
  hashWithSHA3,
  generateEncryptionKey,
} from "../../../utils/crypto";
import CryptoJS from "crypto-js";
import { TEXTS } from "./../../../assets/locales/texts.js";
import CreatePrivateKey from "../create_private_key/CreatePrivateKey.jsx";
import visibleIcon from "./../../../assets/images/visible_icon.svg";
import notVisibleIcon from "./../../../assets/images/not_visible_icon.svg";
import ErrorIcon from "./../../../assets/images/error_icon.svg";
import "./ManageAccess.css";

export default function ManageAccess({ setIsPrivateKeyValid }) {
  const { currentUser } = useAuth();
  const { contextPrivateKey, setContextPrivateKey } = useKey();
  // const { data, loading, error, fetchData } = useFetch();
  // const { response, postloading, posterror, postData } = usePost();

  // const handleButtonClick = () => {
  //   fetchData("get_chain");
  // postData("add_data", {
  //   user: "Alonso",
  //   platform: "Canvas",
  //   key: "123456",
  //   salt: "salt123",
  // });
  // };

  const [privateKey, setPrivateKey] = useState("");
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isOpenNewPasswordPopup, setIsOpenNewPasswordPopup] = useState(false);

  // Consultar el nombre de usuario
  useEffect(() => {
    getUsername(currentUser.uid)
      .then((name) => {
        // Guardar el username
        setUsername(name);
      })
      .catch((error) => {
        // Manejar cualquier error de consulta
        console.log("Error consultando el nombre de usuario", error);
      });
  }, []);

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
          if (storedPrivateKey || contextPrivateKey != "") {
            setPrivateKey(storedPrivateKey);
          } else {
            getUserData();
          }
        }
      })
      .catch((error) => {
        console.log(
          "Error al verificar la existencia de la clave privada:",
          error
        );
      });
  }, []);

  const getUserData = () => {
    const hashUidUser = hashWithSHA3(currentUser.uid);
    fetchData(`get_user?uid_user=${hashUidUser}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.data) {
          setUserData(data.data);
        } else {
          console.log(data);
        }
      })
      .catch((error) => {
        if (error === "AbortError") {
          console.log("Request cancelled");
        } else {
          console.log("Error al recibir los datos del usuario", error);
          // setErrorMessage(TEXTS.errorCreatePrivateKey.en);
        }
      })
      .finally(() => setIsChecking(false));
  };

  // Comprobar si la clave privada es correcta
  const handleKeyVerify = (e) => {
    e.preventDefault();

    if (!isChecking && userData) {
      const salt = CryptoJS.enc.Hex.parse(userData.salt);
      const iv = CryptoJS.enc.Hex.parse(userData.iv);
      const encryptedData = userData.encrypted_data;

      const kdfPrivateKey = generateDerivedKey(privateKey, salt);
      const hashUsername = hashWithSHA3(username);
      const encryptedMessage = encryptMessage(hashUsername, kdfPrivateKey, iv);

      if (encryptedData === encryptedMessage) {
        // Encriptar la clave privada para guardarla
        const defaultEncryptionKey = hashWithSHA3(currentUser.uid);
        const encryptedMessage = encryptMessage(
          kdfPrivateKey.toString(),
          // "yago",
          defaultEncryptionKey,
          // "yago",
          CryptoJS.enc.Hex.parse("iv")
        );

        // Guardar la clave privada en sessionStorage y en el contexto
        // sessionStorage.setItem("privateKey", encryptedMessage);
        setContextPrivateKey(encryptedMessage);

        setIsPrivateKeyValid(true);
      } else {
        // La clave privada es errónea
        setErrorMessage(TEXTS.errorWrongPrivateKey.en);
        console.log(TEXTS.errorWrongPrivateKey.es);
      }
      setIsChecking(false);
    }
  };

  const handleClosePopup = () => {
    setIsOpenNewPasswordPopup(false);
  };

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
        {errorMessage != "" && (
          <div className="error-container" style={{ marginTop: "20px" }}>
            <img src={ErrorIcon} className="error-icon" alt="Error icon" />
            <span className="error-message">{errorMessage}</span>
          </div>
        )}
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
