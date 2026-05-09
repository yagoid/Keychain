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
} from "../../../utils/crypto";
import CryptoJS from "crypto-js";
import { TEXTS } from "./../../../assets/locales/texts.js";
import CreatePrivateKey from "../create_private_key/CreatePrivateKey.jsx";
import visibleIcon from "./../../../assets/images/visible_icon.svg";
import notVisibleIcon from "./../../../assets/images/not_visible_icon.svg";
import "./ManageAccess.css";

export default function ManageAccess({ setIsPrivateKeyValid }) {
  const { currentUser } = useAuth();
  const { contextPrivateKey, setContextPrivateKey } = useKey();

  const [privateKey, setPrivateKey] = useState("");
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isOpenNewPasswordPopup, setIsOpenNewPasswordPopup] = useState(false);

  useEffect(() => {
    getUsername(currentUser.uid)
      .then((name) => setUsername(name))
      .catch((error) => console.log("Error consultando el nombre de usuario", error));
  }, []);

  useEffect(() => {
    privateKeyExists(currentUser.uid)
      .then((exists) => {
        if (!exists) {
          setIsOpenNewPasswordPopup(true);
        } else {
          const storedPrivateKey = sessionStorage.getItem("privateKey");
          if (storedPrivateKey || contextPrivateKey != "") {
            setPrivateKey(storedPrivateKey);
          } else {
            getUserData();
          }
        }
      })
      .catch((error) => {
        console.log("Error al verificar la existencia de la clave privada:", error);
      });
  }, []);

  const getUserData = () => {
    const hashUidUser = hashWithSHA3(currentUser.uid);
    fetchData(`get_user?uid_user=${hashUidUser}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.data) setUserData(data.data);
      })
      .catch((error) => {
        if (error === "AbortError") {
          console.log("Request cancelled");
        } else {
          console.log("Error al recibir los datos del usuario", error);
        }
      })
      .finally(() => setIsChecking(false));
  };

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
        const defaultEncryptionKey = hashWithSHA3(currentUser.uid);
        const encryptedMessage2 = encryptMessage(
          kdfPrivateKey.toString(),
          defaultEncryptionKey,
          CryptoJS.enc.Hex.parse("iv")
        );
        setContextPrivateKey(encryptedMessage2);
        setIsPrivateKeyValid(true);
      } else {
        setErrorMessage(TEXTS.errorWrongPrivateKey.en);
      }
      setIsChecking(false);
    } else {
      setErrorMessage(TEXTS.errorVerifyPrivateKey.en);
    }
  };

  const handleClosePopup = () => setIsOpenNewPasswordPopup(false);

  return (
    <div className="acc">
      <header className="acc__head">
        <div className="acc__head-meta">
          <span className="pb-tag">// 0xKEY :: VERIFY</span>
          <span className="acc__head-coord">// VAULT_LOCKED — REQUIRES PRIVATE KEY</span>
        </div>
        <h1 className="acc__title">
          <span className="acc__title-thin">UNLOCK</span>
          <span className="acc__title-bold">VAULT</span>
        </h1>
        <p className="acc__sub">{TEXTS.accessWith.en}.</p>
      </header>

      <div className="acc__grid">
        <form className="acc__form pb-stack" onSubmit={handleKeyVerify}>
          <div className="pb-field">
            <label className="pb-field__label">{TEXTS.privateKey.en}</label>
            <input
              type={showPrivateKey ? "text" : "password"}
              placeholder="0x••••••••••••••••"
              value={privateKey || ""}
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

          <button type="submit" className="main-btn main-btn--plasma acc__submit">
            <span className="main-btn__text">{TEXTS.enter.en.toUpperCase()}</span>
            <span className="main-btn__arrow">→</span>
          </button>
        </form>

        <aside className="acc__aside">
          <div className="acc__aside-coord">// SAFETY · READ ME</div>
          <div className="acc__aside-svg" aria-hidden="true">
            <svg viewBox="0 0 200 200" width="100%" height="100%">
              <defs>
                <linearGradient id="lock" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1cb0e6" />
                  <stop offset="100%" stopColor="#1499c5" />
                </linearGradient>
              </defs>
              <rect x="60" y="90" width="80" height="70" fill="none" stroke="url(#lock)" strokeWidth="2" />
              <path d="M75 90 V60 a25 25 0 0 1 50 0 V90" fill="none" stroke="url(#lock)" strokeWidth="2" />
              <circle cx="100" cy="125" r="6" fill="#4adb84">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <line x1="100" y1="131" x2="100" y2="148" stroke="#4adb84" strokeWidth="2" />
            </svg>
          </div>
          <ul className="acc__aside-list">
            <li><span>01</span> Your key never leaves your device.</li>
            <li><span>02</span> Lose it, lose access — there is no recovery.</li>
            <li><span>03</span> Each session is encrypted in memory only.</li>
          </ul>
        </aside>
      </div>

      {isOpenNewPasswordPopup && (
        <CreatePrivateKey
          onClose={handleClosePopup}
          setIsPrivateKeyValid={setIsPrivateKeyValid}
        />
      )}
    </div>
  );
}
