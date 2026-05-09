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
import { TEXTS } from "../../../assets/locales/texts.js";
import CryptoJS from "crypto-js";
import visibleIcon from "./../../../assets/images/visible_icon.svg";
import notVisibleIcon from "./../../../assets/images/not_visible_icon.svg";
import "./NewPasswordPopup.css";

export default function NewPasswordPupup({
  onClose,
  setPlatforms,
  consultPlatforms,
}) {
  const { currentUser } = useAuth();
  const { contextPrivateKey } = useKey();

  const [platform, setPlatform] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSaveBlock = async (e) => {
    e.preventDefault();

    if (password != repeatPassword) {
      setErrorMessage(TEXTS.repeatPasswordError.en);
      return;
    }

    if (!isSaving) {
      setIsSaving(true);
      if (!(await platformExists(currentUser.uid, platform))) {
        addNewPlatform(currentUser.uid, platform)
          .then(() => {
            addPasswordInBlockchian();
          })
          .catch((error) => {
            console.log("Error al guardar el nuevo bloque:", error);
            setErrorMessage(TEXTS.errorNewBlock.en);
            setIsSaving(false);
          });
      } else {
        setErrorMessage(TEXTS.errorPlatformExists.en);
        setIsSaving(false);
      }
    }
  };

  const addPasswordInBlockchian = () => {
    const storedPrivateKey = sessionStorage.getItem("privateKey");
    if (storedPrivateKey || contextPrivateKey != "") {
      const iv = CryptoJS.lib.WordArray.random(128 / 8);
      const hashUidUser = hashWithSHA3(currentUser.uid);
      const hashPlatform = hashWithSHA3(platform);

      const defaultEncryptionKey = hashWithSHA3(currentUser.uid);
      const decryptedPrivateKey = decryptMessage(
        contextPrivateKey,
        defaultEncryptionKey,
        CryptoJS.enc.Hex.parse("iv")
      );

      const encryptedMessage = encryptMessage(
        password,
        CryptoJS.enc.Hex.parse(decryptedPrivateKey),
        iv
      );

      postData("add_data", {
        user: hashUidUser,
        platform: hashPlatform,
        key: encryptedMessage,
        iv: iv.toString(),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setPlatforms((prevPlatforms) => [...prevPlatforms, platform]);
          consultPlatforms();
          onClose();
        })
        .catch((error) => {
          console.log("Error al enviar datos a la blockchian", error);
          setErrorMessage(TEXTS.errorCreatePrivateKey.en);
        })
        .finally(() => setIsSaving(false));
    }
  };

  return (
    <>
      <div className="pb-overlay" onClick={onClose} />
      <aside className="pb-panel" role="dialog" aria-modal="true">
        <header className="pb-panel__head">
          <div>
            <span className="np__coord">// FORGE BLOCK</span>
            <h2 className="pb-panel__title">{TEXTS.enterNewKey.en}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="pb-panel__close"
            aria-label="Close"
          >×</button>
        </header>

        <form className="pb-panel__body pb-stack" onSubmit={handleSaveBlock}>
          <div className="pb-field">
            <label className="pb-field__label">{TEXTS.platform.en}</label>
            <input
              type="text"
              placeholder="github · gitlab · banco …"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="pb-input"
              required
            />
            <span className="pb-field__scar" />
          </div>

          <div className="pb-field">
            <label className="pb-field__label">{TEXTS.password.en}</label>
            <input
              type={showPrivateKey ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pb-input"
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

          <div className="pb-field">
            <label className="pb-field__label">{TEXTS.repeatPassword.en}</label>
            <input
              type={showPrivateKey ? "text" : "password"}
              placeholder="••••••••"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className="pb-input"
              required
            />
            <span className="pb-field__scar" />
          </div>

          {errorMessage && (
            <div className="pb-error">
              <span className="pb-error__bar" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="np__actions">
            <button
              type="button"
              onClick={onClose}
              className="main-btn main-btn--ghost"
            >
              <span className="main-btn__text">{TEXTS.cancel.en}</span>
            </button>
            <button type="submit" className="main-btn main-btn--plasma">
              <span className="main-btn__text">
                {isSaving ? "ANCHORING…" : "+ " + TEXTS.save.en.toUpperCase()}
              </span>
              <span className="main-btn__arrow">→</span>
            </button>
          </div>

          <p className="np__note">
            // Pressing save anchors a new block to the chain. The previous block
            (if modifying) becomes orphaned but remains in the ledger history.
          </p>
        </form>
      </aside>
    </>
  );
}
