import React, { useState, useEffect } from "react";
import {
  getPlatforms,
  removePlatform,
  addNewPlatform,
  platformExists,
} from "../../../services/firebase/database.js";
import { useAuth } from "../../../contexts/authContext/index.jsx";
import { useKey } from "./../../../contexts/keyContext/keyContext";
import { fetchData } from "./../../../services/blockchain/api";
import { postData } from "./../../../services/blockchain/api";
import {
  decryptMessage,
  hashWithSHA3,
  encryptMessage,
} from "../../../utils/crypto";
import { TEXTS } from "../../../assets/locales/texts.js";
import CryptoJS from "crypto-js";
import visibleIcon from "./../../../assets/images/visible_icon.svg";
import notVisibleIcon from "./../../../assets/images/not_visible_icon.svg";
import trashIcon from "./../../../assets/images/trash_icon.svg";
import NewPasswordPupup from "../new_password/NewPasswordPopup.jsx";
import CheckDataPupup from "../check_data/CheckDataPopup.jsx";
import "./PasswordManager.css";

export default function PasswordManager() {
  const { currentUser } = useAuth();
  const { contextPrivateKey } = useKey();

  const [platforms, setPlatforms] = useState([]);
  const [isBlockView, setIsBlockView] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isOpenNewPasswordPopup, setIsOpenNewPasswordPopup] = useState(false);
  const [isOpenCheckDataPopup, setIsOpenCheckDataPopup] = useState(false);
  const [dataPasswords, setDataPasswords] = useState([]);
  const [blockchainUserData, setBlockchainUserData] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 970) setIsBlockView(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const decryptPrivateKey = () => {
    const storedPrivateKey = sessionStorage.getItem("privateKey");
    if (storedPrivateKey || contextPrivateKey != "") {
      const defaultEncryptionKey = hashWithSHA3(currentUser.uid);
      const decryptedPrivateKey = decryptMessage(
        contextPrivateKey,
        defaultEncryptionKey,
        CryptoJS.enc.Hex.parse("iv")
      );
      return decryptedPrivateKey;
    }
  };

  useEffect(() => {
    consultPlatforms();
  }, []);

  const consultPlatforms = () => {
    getPlatforms(currentUser.uid)
      .then((platforms) => {
        getDataPassword(platforms);
      })
      .catch((error) => {
        console.log("Error al guardar la platafroma en firebase:", error);
      });
  };

  const getDataPassword = (platforms) => {
    const hashUidUser = hashWithSHA3(currentUser.uid);
    setDataPasswords([]);
    setBlockchainUserData([]);
    var hashPlatform = "";

    const decryptedPrivateKey = decryptPrivateKey();

    for (const platform of platforms) {
      hashPlatform = hashWithSHA3(platform);
      fetchData(`get_data?user=${hashUidUser}&platform=${hashPlatform}`)
        .then((response) => response.json())
        .then((data) => {
          const decryptedPassword = decryptMessage(
            data.data.data[0].key,
            CryptoJS.enc.Hex.parse(decryptedPrivateKey),
            CryptoJS.enc.Hex.parse(data.data.data[0].iv)
          );

          setDataPasswords((prevData) => {
            if (!prevData.some((item) => item.platform === platform)) {
              return [
                ...prevData,
                {
                  platform: platform,
                  id: prevData.length + 1,
                  key: decryptedPassword,
                  timestamp: data.data.timestamp,
                  proofOfWork: data.data.proof,
                },
              ];
            }
            return prevData;
          });

          setBlockchainUserData((prevData) => [
            ...prevData,
            JSON.stringify(data.data, null, 2),
          ]);
        })
        .catch((error) => {
          if (error === "AbortError") {
            console.log("Request cancelled");
          } else {
            console.log("Error al recibir los datos de las contraseñas", error);
          }
        });
    }
  };

  const handleOpenAddPasswordPopUp = () => setIsOpenNewPasswordPopup(true);
  const handleCheckDataOnBlockchainPopUp = () => setIsOpenCheckDataPopup(true);

  const handleSaveChanges = (oldPlatform, newPlatform, newKey) => {
    if (!isSaving) {
      setIsSaving(true);
      removePlatform(currentUser.uid, oldPlatform)
        .then(() => {
          addNewPlatform(currentUser.uid, newPlatform)
            .then(() => {
              changePasswordInBlockchian(newPlatform, newKey);
            })
            .catch((error) => {
              console.log("Error al guardar el nuevo bloque:", error);
              setIsSaving(false);
            });
        })
        .catch((error) => {
          console.log("Error al modificar la platafroma en firebase:", error);
          setIsSaving(false);
        });
    }
  };

  const changePasswordInBlockchian = (newPlatform, key) => {
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const hashUidUser = hashWithSHA3(currentUser.uid);
    const hashPlatform = hashWithSHA3(newPlatform);

    const decryptedPrivateKey = decryptPrivateKey();

    const encryptedMessage = encryptMessage(
      key,
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
        consultPlatforms();
      })
      .catch((error) => {
        console.log("Error al enviar datos a la blockchian", error);
      })
      .finally(() => setIsSaving(false));
  };

  const handleClosePopup = () => {
    setIsOpenNewPasswordPopup(false);
    setIsOpenCheckDataPopup(false);
  };

  const count = dataPasswords.length;

  return (
    <div className="pm">
      {/* HEAD ============================================ */}
      <header className="pm__head">
        <div className="pm__head-meta">
          <span className="pb-tag">// LEDGER · MY KEYS</span>
          <span className="pm__head-coord">// VAULT :: 0xA1 :: BLOCK {String(count).padStart(4, "0")}</span>
        </div>
        <h1 className="pm__title">
          {TEXTS.myKeys.en}
          <span className="pm__title-count">[{String(count).padStart(2, "0")}]</span>
        </h1>
        <p className="pm__sub">
          Each credential lives as an encrypted block on the chain.
          Modifying one anchors a new block; nothing is overwritten.
        </p>

        <div className="pm__toolbar">
          <div
            className="pb-segmented"
            role="tablist"
            aria-label="View mode"
          >
            <button
              type="button"
              className={`pb-segmented__option ${isBlockView ? "pb-segmented__option--active" : ""}`}
              onClick={() => setIsBlockView(true)}
              role="tab"
              aria-selected={isBlockView}
            >
              <span aria-hidden="true">▦</span> CHAIN
            </button>
            <button
              type="button"
              className={`pb-segmented__option ${!isBlockView ? "pb-segmented__option--active" : ""}`}
              onClick={() => setIsBlockView(false)}
              role="tab"
              aria-selected={!isBlockView}
            >
              <span aria-hidden="true">≡</span> LEDGER
            </button>
          </div>

          <div className="pm__toolbar-actions">
            {dataPasswords.length !== 0 && (
              <button
                type="button"
                className="main-btn main-btn--ghost"
                onClick={handleCheckDataOnBlockchainPopUp}
              >
                <span className="main-btn__text">CHAIN PROOF</span>
                <span className="main-btn__arrow">↗</span>
              </button>
            )}
            <button
              type="button"
              className="main-btn main-btn--plasma"
              onClick={handleOpenAddPasswordPopUp}
            >
              <span className="main-btn__text">+ {TEXTS.addPassword.en.toUpperCase()}</span>
              <span className="main-btn__arrow">→</span>
            </button>
          </div>
        </div>
      </header>

      {/* BODY ============================================ */}
      {count === 0 ? (
        <EmptyState onAdd={handleOpenAddPasswordPopUp} />
      ) : isBlockView ? (
        <PasswordManagerBlocks
          dataPasswords={dataPasswords}
          handleSaveChanges={handleSaveChanges}
          currentUser={currentUser}
          consultPlatforms={consultPlatforms}
        />
      ) : (
        <PasswordManagerTable
          dataPasswords={dataPasswords}
          handleSaveChanges={handleSaveChanges}
        />
      )}

      {isOpenNewPasswordPopup && (
        <NewPasswordPupup
          onClose={handleClosePopup}
          setPlatforms={setPlatforms}
          consultPlatforms={consultPlatforms}
        />
      )}
      {isOpenCheckDataPopup && (
        <CheckDataPupup
          onClose={handleClosePopup}
          blockchainUserData={blockchainUserData}
        />
      )}
    </div>
  );
}

/* ---------- Empty state ---------- */
const EmptyState = ({ onAdd }) => (
  <div className="pm__empty">
    <pre className="pm__empty-art" aria-hidden="true">{`
   ┌──────────────────┐
   │  // VAULT EMPTY  │
   │                  │
   │   ░░░░░░░░░░░░   │
   │   ░░░░░░░░░░░░   │
   │                  │
   └──────────────────┘
            │
            ▼
       NO BLOCKS
`}</pre>
    <h3 className="pm__empty-title">// LEDGER UNINITIALIZED</h3>
    <p className="pm__empty-text">
      Anchor your first credential to bootstrap the chain.
    </p>
    <button type="button" className="main-btn main-btn--plasma" onClick={onAdd}>
      <span className="main-btn__text">+ FORGE FIRST BLOCK</span>
      <span className="main-btn__arrow">→</span>
    </button>
  </div>
);

/* ---------- Block (chain) view ---------- */
const PasswordManagerBlocks = ({
  dataPasswords,
  handleSaveChanges,
  currentUser,
  consultPlatforms,
}) => (
  <section className="pm__chain pb-stagger">
    {dataPasswords.map((block, index) => (
      <div className="pm__chain-row" key={`${block.platform}-${index}`}>
        <PasswordBlock
          block={block}
          index={index}
          saveChanges={handleSaveChanges}
          currentUser={currentUser}
          consultPlatforms={consultPlatforms}
        />
        {index < dataPasswords.length - 1 && (
          <div className="pm__chain-connector" aria-hidden="true">
            <span className="pm__chain-line" />
            <span className="pm__chain-hex" />
            <span className="pm__chain-line" />
          </div>
        )}
      </div>
    ))}
  </section>
);

const PasswordBlock = ({
  block,
  index,
  saveChanges,
  currentUser,
  consultPlatforms,
}) => {
  const [platform, setPlatform] = useState(block.platform);
  const [key, setKey] = useState(block.key);
  const [errorMessage, setErrorMessage] = useState("");
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [editableTexts, setEditableTexts] = useState(false);

  const handleModifyText = async () => {
    setErrorMessage("");

    if (editableTexts && (key == "" || platform == "")) return;
    if (editableTexts && key == block.key && platform == block.platform) {
      setEditableTexts(!editableTexts);
      return;
    }

    if (editableTexts) {
      if (
        platform == block.platform ||
        !(await platformExists(currentUser.uid, platform))
      ) {
        saveChanges(block.platform, platform, key);
        setEditableTexts(!editableTexts);
        setErrorMessage("");
      } else {
        setErrorMessage(TEXTS.errorPlatformExists.en);
      }
    } else {
      setEditableTexts(!editableTexts);
    }
  };

  const handleDelatePassword = () => {
    if (editableTexts) {
      removePlatform(currentUser.uid, block.platform)
        .then(() => {
          consultPlatforms();
          setEditableTexts(!editableTexts);
        })
        .catch((error) => {
          console.log("Error al eliminar la platafroma en firebase:", error);
          setEditableTexts(!editableTexts);
        });
    }
  };

  const handleCancelModifyText = () => {
    setEditableTexts(!editableTexts);
    setPlatform(block.platform);
    setKey(block.key);
    setErrorMessage("");
  };

  const blockHash = `0x${(block.proofOfWork || "0000")
    .toString()
    .slice(0, 8)
    .padEnd(8, "0")}`;

  return (
    <article className={`pm__block ${editableTexts ? "pm__block--edit" : ""}`}>
      <header className="pm__block-head">
        <span className="pm__block-coord pb-coord pb-coord--alive">
          // BLOCK {String(index).padStart(4, "0")} :: ANCHORED
        </span>
        <span className="pm__block-num">{String(index + 1).padStart(2, "0")}</span>
      </header>

      <div className="pm__block-body">
        {/* platform */}
        <div className="pm__block-cell">
          <span className="pm__block-label">// {TEXTS.platform.en.toUpperCase()}</span>
          {editableTexts ? (
            <input
              className="pb-input pm__block-input"
              type="text"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              required
            />
          ) : (
            <span className="pm__block-value pm__block-value--display">
              {platform}
            </span>
          )}
        </div>

        {/* key */}
        <div className="pm__block-cell">
          <span className="pm__block-label">// {TEXTS.password.en.toUpperCase()}</span>
          <div className="pm__block-key">
            {editableTexts ? (
              <input
                className="pb-input pm__block-input pm__block-input--mono"
                type={visiblePassword ? "text" : "password"}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                required
              />
            ) : (
              <span className="pm__block-value pm__block-value--mono">
                {visiblePassword ? key : key.replace(/./g, "•")}
              </span>
            )}
            <button
              type="button"
              onClick={() => setVisiblePassword(!visiblePassword)}
              className="pm__block-eye"
              aria-label={visiblePassword ? "Hide" : "Show"}
            >
              <img
                src={!visiblePassword ? visibleIcon : notVisibleIcon}
                alt=""
              />
            </button>
          </div>
          {errorMessage && (
            <div className="pb-error pm__block-error">
              <span className="pb-error__bar" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>

      <footer className="pm__block-foot">
        <div className="pm__block-meta">
          <span className="pm__block-meta-cell">
            <span className="pm__block-meta-label">// HASH</span>
            <span className="pm__block-meta-val pb-mono">{blockHash}</span>
          </span>
          <span className="pm__block-meta-cell">
            <span className="pm__block-meta-label">// TIMESTAMP</span>
            <span className="pm__block-meta-val pb-mono">
              {block.timestamp || "—"}
            </span>
          </span>
          <span className="pm__block-meta-cell">
            <span className="pm__block-meta-label">// PoW</span>
            <span className="pm__block-meta-val pb-mono">
              {String(block.proofOfWork || "—").slice(0, 12)}
            </span>
          </span>
        </div>

        <div className="pm__block-actions">
          <button
            type="button"
            className={`main-btn main-btn--sm ${editableTexts ? "main-btn--plasma" : "main-btn--ghost"}`}
            onClick={handleModifyText}
            style={{ minWidth: 120, minHeight: 38 }}
          >
            <span className="main-btn__text">
              {editableTexts ? TEXTS.save.en : TEXTS.modify.en}
            </span>
          </button>
          {editableTexts && (
            <>
              <button
                type="button"
                className="main-btn main-btn--ghost main-btn--sm"
                onClick={handleCancelModifyText}
                style={{ minWidth: 100, minHeight: 38 }}
              >
                <span className="main-btn__text">{TEXTS.cancel.en}</span>
              </button>
              <button
                type="button"
                className="pm__block-trash"
                onClick={handleDelatePassword}
                aria-label="Delete"
              >
                <img src={trashIcon} alt="" />
              </button>
            </>
          )}
        </div>
      </footer>
    </article>
  );
};

/* ---------- Table (ledger) view ---------- */
const PasswordManagerTable = ({ dataPasswords, handleSaveChanges }) => (
  <div className="pm__ledger-wrap">
    <table className="pb-ledger pm__ledger">
      <thead>
        <tr>
          <th style={{ width: "8%" }}>BLOCK</th>
          <th style={{ width: "32%" }}>{TEXTS.platform.en}</th>
          <th>{TEXTS.password.en}</th>
          <th style={{ width: "100px" }} aria-label="reveal" />
          <th style={{ width: "20%" }}>HASH</th>
        </tr>
      </thead>
      <tbody>
        {dataPasswords.map((row, index) => (
          <PasswordRow
            key={index}
            row={row}
            index={index}
            saveChanges={handleSaveChanges}
          />
        ))}
      </tbody>
    </table>
  </div>
);

const PasswordRow = ({ row, index, saveChanges }) => {
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [editableTexts, setEditableTexts] = useState(false);
  const [platform, setPlatform] = useState(row.platform);
  const [key, setKey] = useState(row.key);

  const blockHash = `0x${(row.proofOfWork || "0000")
    .toString()
    .slice(0, 8)
    .padEnd(8, "0")}`;

  return (
    <tr>
      <td>
        <span className="pm__ledger-num">{String(index).padStart(4, "0")}</span>
      </td>
      <td>
        {editableTexts ? (
          <input
            className="pb-input pm__ledger-input"
            type="text"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            required
          />
        ) : (
          <span className="pm__ledger-platform">{platform}</span>
        )}
      </td>
      <td>
        {editableTexts ? (
          <input
            className="pb-input pm__ledger-input"
            type={visiblePassword ? "text" : "password"}
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        ) : (
          <span className="pm__ledger-key">
            {visiblePassword ? key : key.replace(/./g, "•")}
          </span>
        )}
      </td>
      <td>
        <button
          type="button"
          onClick={() => setVisiblePassword(!visiblePassword)}
          className="pm__ledger-eye"
          aria-label={visiblePassword ? "Hide" : "Show"}
        >
          <img src={!visiblePassword ? visibleIcon : notVisibleIcon} alt="" />
        </button>
      </td>
      <td>
        <span className="pm__ledger-hash">{blockHash}</span>
      </td>
    </tr>
  );
};
