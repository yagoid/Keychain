import React, { useState, useEffect } from "react";
import {
  changePrivateKeyState,
  getUsername,
} from "../../../services/firebase/database.js";
import { useAuth } from "../../../contexts/authContext/index.jsx";
import { useKey } from "./../../../contexts/keyContext/keyContext";
import { postData } from "./../../../services/blockchain/api";
import {
  encryptMessage,
  generateDerivedKey,
  hashWithSHA3,
} from "../../../utils/crypto";
import { checkPasswordStrength } from "../../../utils/passwordSecurity";
import { TEXTS } from "../../../assets/locales/texts.js";
import CryptoJS from "crypto-js";
import visibleIcon from "./../../../assets/images/visible_icon.svg";
import notVisibleIcon from "./../../../assets/images/not_visible_icon.svg";
import "./CreatePrivateKey.css";

export default function CreatePrivateKey({ onClose, setIsPrivateKeyValid }) {
  const { currentUser } = useAuth();
  const { setContextPrivateKey } = useKey();

  const [privateKey, setPrivateKey] = useState("");
  const [username, setUsername] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getUsername(currentUser.uid)
      .then((name) => setUsername(name))
      .catch((error) => console.log("Error al consultar el nombre de usuario", error));
  }, []);

  const handleCreatePrivateKey = async (e) => {
    e.preventDefault();

    const checkedPasswordStrength = checkPasswordStrength(privateKey);
    if (checkedPasswordStrength != true) {
      setErrorMessage(checkedPasswordStrength);
      return;
    }

    if (!isSaving) {
      setIsSaving(true);

      changePrivateKeyState(currentUser.uid, true)
        .then(() => {
          addUserInBlockchian();
        })
        .catch((error) => {
          console.log("Error al guardar el estado:", error);
          setIsSaving(false);
        });
    }
  };

  const addUserInBlockchian = () => {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const kdfPrivateKey = generateDerivedKey(privateKey, salt);
    const hashUsername = hashWithSHA3(username);
    const hashUidUser = hashWithSHA3(currentUser.uid);

    const encryptedMessage = encryptMessage(hashUsername, kdfPrivateKey, iv);

    postData("add_user", {
      uid_user: hashUidUser,
      encrypted_data: encryptedMessage,
      salt: salt.toString(),
      iv: iv.toString(),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        const defaultEncryptionKey = hashWithSHA3(currentUser.uid);
        const encryptedMessage2 = encryptMessage(
          kdfPrivateKey.toString(),
          defaultEncryptionKey,
          CryptoJS.enc.Hex.parse("iv")
        );
        setContextPrivateKey(encryptedMessage2);
        setIsPrivateKeyValid(true);
        onClose();
      })
      .catch((error) => {
        console.log("Error al enviar datos a la blockchian", error);
        setErrorMessage(TEXTS.errorCreatePrivateKey.en);

        changePrivateKeyState(currentUser.uid, false).catch((err) => {
          console.log("Error al revertir el estado de la private key:", err);
        });
      })
      .finally(() => setIsSaving(false));
  };

  return (
    <>
      <div className="pb-overlay" />
      <aside className="pb-panel cpk" role="dialog" aria-modal="true">
        <header className="pb-panel__head">
          <div>
            <span className="cpk__coord">// FORGE GENESIS KEY</span>
            <h2 className="pb-panel__title">{TEXTS.createPrivateKey.en}</h2>
          </div>
        </header>

        <form className="pb-panel__body pb-stack" onSubmit={handleCreatePrivateKey}>
          <div className="cpk__warning">
            <span className="cpk__warning-bar" />
            <div>
              <strong>// READ THIS BEFORE CONTINUING</strong>
              <p>{TEXTS.createPrivateKeyInfo.en}</p>
            </div>
          </div>

          <div className="pb-field">
            <label className="pb-field__label">{TEXTS.privateKey.en}</label>
            <input
              type={showPrivateKey ? "text" : "password"}
              placeholder="••••••••••••"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              className="pb-input pm__block-input--mono"
              required
            />
            <button
              type="button"
              className="pb-field__icon"
              onClick={() => setShowPrivateKey(!showPrivateKey)}
              aria-label={showPrivateKey ? "Hide" : "Show"}
            >
              <img
                src={!showPrivateKey ? visibleIcon : notVisibleIcon}
                alt=""
                style={{ width: 22, height: 22, filter: "invert(0.85)" }}
              />
            </button>
            <span className="pb-field__scar" />
          </div>

          {errorMessage && (
            <div className="pb-error">
              <span className="pb-error__bar" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button type="submit" className="main-btn main-btn--plasma cpk__submit">
            <span className="main-btn__text">
              {isSaving ? "MINTING…" : "FORGE & ANCHOR"}
            </span>
            <span className="main-btn__arrow">→</span>
          </button>
        </form>
      </aside>
    </>
  );
}
