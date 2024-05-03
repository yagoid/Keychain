import React, { useState, useEffect } from "react";
import {
  getPlatforms,
  removePlatform,
  addNewPlatform,
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
import { checkPasswordStrength } from "./../../../utils/passwordSecurity";
import { TEXTS } from "../../../assets/locales/texts.js";
import CryptoJS from "crypto-js";
import visibleIcon from "./../../../assets/images/visible_icon.svg";
import notVisibleIcon from "./../../../assets/images/not_visible_icon.svg";
import chainLine from "./../../../assets/images/chain_line_blocks.svg";
import ErrorIcon from "./../../../assets/images/error_icon.svg";
import NewPasswordPupup from "../new_password/NewPasswordPopup.jsx";
import "./PasswordManager.css";
import "./../../buttons/Switch.css";

export default function PasswordManager() {
  const { currentUser } = useAuth();
  const { contextPrivateKey } = useKey();

  const [platforms, setPlatforms] = useState([]);
  const [isBlockView, setIsBlockView] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isOpenNewPasswordPopup, setIsOpenNewPasswordPopup] = useState(false);
  const [dataPasswords, setDataPasswords] = useState([]);

  // La vista se cambia automáticamente a vista de bloque
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 970) {
        setIsBlockView(true);
      }
    };
    handleResize();
    // Agregamos un listener para el evento de cambio de tamaño de la ventana
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const decryptPrivateKey = () => {
    const storedPrivateKey = sessionStorage.getItem("privateKey");
    if (storedPrivateKey || contextPrivateKey != "") {
      // Encriptar la clave privada para guardarla
      const defaultEncryptionKey = hashWithSHA3(currentUser.uid);

      // Desencriptar la clave privada
      const decryptedPrivateKey = decryptMessage(
        contextPrivateKey,
        defaultEncryptionKey,
        CryptoJS.enc.Hex.parse("iv")
      );

      return decryptedPrivateKey;
    }
  };

  // Consultar las plataformas registradas
  useEffect(() => {
    consultPlatforms();
  }, []);

  const consultPlatforms = () => {
    getPlatforms(currentUser.uid)
      .then((platforms) => {
        // Guardar las plataformas
        setPlatforms(platforms);
        getDataPassword(platforms);
      })
      .catch((error) => {
        // Manejar cualquier error de consulta
        console.log("Error al guardar la platafroma en firebase:", error);
      });
  };

  // Recorrer las contraseñas de firebase para conseguir sus datos
  const getDataPassword = (platforms) => {
    const hashUidUser = hashWithSHA3(currentUser.uid);
    setDataPasswords([]);
    var hashPlatform = "";

    const decryptedPrivateKey = decryptPrivateKey();

    for (const platform of platforms) {
      hashPlatform = hashWithSHA3(platform);
      fetchData(`get_data?user=${hashUidUser}&platform=${hashPlatform}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          // console.log(data.data.data[0].key);
          // Desencriptar la contraseña
          const decryptedPassword = decryptMessage(
            data.data.data[0].key,
            CryptoJS.enc.Hex.parse(decryptedPrivateKey),
            CryptoJS.enc.Hex.parse(data.data.data[0].iv)
          );

          // Añadir los datos de la contraseña
          setDataPasswords((prevData) => [
            ...prevData,
            {
              platform: platform,
              id: data.length + 1,
              key: decryptedPassword, // data.data.data[0].key
              timestamp: data.data.timestamp,
              proofOfWork: data.data.proof,
            },
          ]);
        })
        .catch((error) => {
          if (error === "AbortError") {
            console.log("Request cancelled");
          } else {
            console.log("Error al recibir los datos de las contraseñas", error);
            // setErrorMessage(TEXTS.errorCreatePrivateKey.en);
          }
        });
    }
  };

  // Añadir un nuevo bloque/fila
  const handleOpenAddPasswordPopUp = () => {
    setIsOpenNewPasswordPopup(true);
  };

  // Guardar los cambios editados en la variable data
  const handleSaveChanges = (oldPlatform, newPlatform, newKey) => {
    if (!isSaving) {
      setIsSaving(true);
      // Eliminar plataforma
      removePlatform(currentUser.uid, oldPlatform)
        .then(() => {
          // Añadir la nueva plataforma
          addNewPlatform(currentUser.uid, newPlatform)
            .then(() => {
              // Guardar los cambios en blockchian
              changePasswordInBlockchian(newPlatform, newKey);
            })
            .catch((error) => {
              // Manejar cualquier error de registro de username
              console.log("Error al guardar el nuevo bloque:", error);
              setErrorMessage(TEXTS.errorNewBlock.en);
              setIsSaving(false);
            });
        })
        .catch((error) => {
          // Manejar cualquier error de consulta
          console.log("Error al modificar la platafroma en firebase:", error);
          setIsSaving(false);
        });
    }
  };

  const changePasswordInBlockchian = (newPlatform, key) => {
    // Cifrar los datos antes de enviarlos
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const hashUidUser = hashWithSHA3(currentUser.uid);
    const hashPlatform = hashWithSHA3(newPlatform);

    const decryptedPrivateKey = decryptPrivateKey();

    // Encriptar la contraseña con la clave privada
    const encryptedMessage = encryptMessage(
      key,
      CryptoJS.enc.Hex.parse(decryptedPrivateKey),
      iv
    );

    // Enviar los datos a la blockchain
    postData("add_data", {
      user: hashUidUser,
      platform: hashPlatform,
      key: encryptedMessage,
      iv: iv.toString(),
    })
      .then((response) => {
        response.json();
      })
      .then((data) => {
        console.log(data);
        // Encuentra el objeto correspondiente por su id
        // const updatedData = dataPasswords.map((block) => {
        //   if (block.id === id) {
        //     return { ...block, platform: platform, key: key };
        //   }
        //   return block;
        // });
        // setDataPasswords(updatedData);

        // setPlatforms(platform);
        // setPlatforms((prevPlatforms) => [...prevPlatforms, platform]);
        consultPlatforms();
      })
      .catch((error) => {
        console.log("Error al enviar datos a la blockchian", error);
        setErrorMessage(TEXTS.errorCreatePrivateKey.en);
      })
      .finally(() => setIsSaving(false));
  };

  const toggleSwitch = () => {
    setIsBlockView(!isBlockView);
  };

  const handleClosePopup = () => {
    setIsOpenNewPasswordPopup(false);
  };

  return (
    <div className="password-manager">
      <h1>{TEXTS.myKeys.en}</h1>
      <div className="password-manager-container">
        {isBlockView ? (
          <PasswordManagerBlocks
            dataPasswords={dataPasswords}
            handleOpenAddPasswordPopUp={handleOpenAddPasswordPopUp}
            handleSaveChanges={handleSaveChanges}
          />
        ) : (
          <PasswordManagerTable
            dataPasswords={dataPasswords}
            handleSaveChanges={handleSaveChanges}
          />
        )}
      </div>
      <label className="toggle-switch">
        <input type="checkbox" checked={isBlockView} onChange={toggleSwitch} />
        <span className="slider"></span>
      </label>
      <span className="text-switch">{TEXTS.blockView.en}</span>
      {isOpenNewPasswordPopup && (
        <NewPasswordPupup
          onClose={handleClosePopup}
          setPlatforms={setPlatforms}
          consultPlatforms={consultPlatforms}
        />
      )}
    </div>
  );
}

const PasswordManagerBlocks = ({
  dataPasswords,
  handleOpenAddPasswordPopUp,
  handleSaveChanges,
}) => {
  return (
    <section className="password-manager-block">
      <div className="blocks">
        {dataPasswords.map((block, index) => (
          <div className="blocks-lines" key={index}>
            <PasswordBlock block={block} saveChanges={handleSaveChanges} />
            <img
              src={chainLine}
              className={
                index == dataPasswords.length - 1
                  ? "invisible"
                  : "chian_line_icon"
              }
              alt="Chain line"
            />
          </div>
        ))}
      </div>
      <button onClick={handleOpenAddPasswordPopUp} className="btn-add-password">
        {TEXTS.addPassword.en}
      </button>
    </section>
  );
};

const PasswordBlock = ({ block, saveChanges }) => {
  const [platform, setPlatform] = useState(block.platform);
  const [key, setKey] = useState(block.key);
  const [errorMessage, setErrorMessage] = useState("");
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [editableTexts, setEditableTexts] = useState(false);

  // Cambiar el texto cuando se editan los inputs
  const handlePlatformChange = (text) => {
    setPlatform(text);
  };
  const handleKeyChange = (text) => {
    setKey(text);
  };

  // Guardar los cambios editados
  const handleModifyText = () => {
    setErrorMessage("");

    // La contraseña y la plataforma no pueden estar vacías
    if (editableTexts && (key == "" || platform == "")) {
      return;
    }
    // No se guarda si no hay cambios
    if (editableTexts && key == block.key && platform == block.platform) {
      setEditableTexts(!editableTexts);
      return;
    }
    // La contraseña debe ser segura
    const checkedPasswordStrength = checkPasswordStrength(key);
    if (checkedPasswordStrength != true) {
      setErrorMessage(checkedPasswordStrength);
      return;
    }

    setEditableTexts(!editableTexts);

    if (editableTexts) {
      saveChanges(block.platform, platform, key);
    }

    setErrorMessage("");
  };
  // Cancelar edición
  const handleCancelModifyText = () => {
    setEditableTexts(!editableTexts);

    setPlatform(block.platform);
    setKey(block.key);
    setErrorMessage("");
  };

  return (
    <div className="block">
      {/* Platform */}
      <div className="block-section">
        <span className="tittle-block-section">{TEXTS.platform.en}</span>
        {editableTexts ? (
          <input
            className="input-modify-platform"
            type="text"
            value={platform}
            onChange={(e) => handlePlatformChange(e.target.value)}
            required
          />
        ) : (
          <span className="text-block-section platform">{platform}</span>
          // <span className="text-block-section">{key}</span>
        )}
      </div>
      {/* Key */}
      <div className="block-section">
        <span className="tittle-block-section">{TEXTS.password.en}</span>
        <div className="key-block-section">
          {editableTexts ? (
            <input
              className="input-modify-key"
              type={visiblePassword ? "text" : "password"}
              value={key}
              onChange={(e) => handleKeyChange(e.target.value)}
              required
            />
          ) : visiblePassword ? (
            <span className="text-block-section">{key}</span>
          ) : (
            <span className="text-block-section">{key.replace(/./g, "*")}</span>
          )}
          <img
            src={!visiblePassword ? visibleIcon : notVisibleIcon}
            onClick={() => setVisiblePassword(!visiblePassword)}
            className="eye_icon"
            alt={!visiblePassword ? "Eye visible icon" : "Eye not visible icon"}
          />
        </div>
        {errorMessage != "" && (
          <div className="error-block-container">
            <img src={ErrorIcon} className="error-icon" alt="Error icon" />
            <span className="error-block-message">{errorMessage}</span>
          </div>
        )}
      </div>
      {/* Timestamp */}
      <div className="block-section">
        <span className="tittle-block-section">{TEXTS.timestamp.en}</span>
        <span className="text-block-section">{block.timestamp}</span>
      </div>
      {/* Proof of Work */}
      <div className="block-section">
        <span className="tittle-block-section">{TEXTS.proofOfWork.en}</span>
        <span className="text-block-section">{block.proofOfWork}</span>
      </div>
      {/* Modify */}
      <div className="modify-block-section">
        <button
          type="submit"
          className="btn-modify-password"
          onClick={() => handleModifyText()}
        >
          {editableTexts ? TEXTS.save.en : TEXTS.modify.en}
        </button>
        {editableTexts && (
          <button
            className="btn-modify-password"
            onClick={() => handleCancelModifyText()}
          >
            {TEXTS.cancel.en}
          </button>
        )}
      </div>
    </div>
  );
};

const PasswordManagerTable = ({ dataPasswords, handleSaveChanges }) => {
  return (
    <div className="table-vertical-scroll">
      <table className="password-manager-table">
        <colgroup>
          <col style={{ width: "45%" }} />
          <col style={{ width: "25%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "20%" }} />
        </colgroup>
        <thead>
          <tr>
            <th className="column-tittle">{TEXTS.platform.en}</th>
            <th className="column-tittle">{TEXTS.password.en}</th>
            <th className="column-tittle"></th>
            <th className="column-tittle">
              {/* <button className="btn-add-password">{TEXTS.addPassword.en}</button> */}
            </th>
          </tr>
        </thead>
        <tbody>
          {dataPasswords.map((row, index) => (
            <PasswordRow
              key={index}
              row={row}
              saveChanges={handleSaveChanges}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PasswordRow = ({ row, saveChanges }) => {
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [editableTexts, setEditableTexts] = useState(false);
  const [platform, setPlatform] = useState(row.platform);
  const [key, setKey] = useState(row.key);

  // Cambiar el texto cuando se editan los inputs
  const handlePlatformChange = (text) => {
    setPlatform(text);
  };
  const handleKeyChange = (text) => {
    setKey(text);
  };

  // Guardar los cambios editados
  const handleModifyText = () => {
    // La contraseña y la plataforma no pueden estar vacías
    if (editableTexts && (key == "" || platform == "")) {
      return;
    }
    // No se guarda si no hay cambios
    if (editableTexts && key == row.key && platform == row.platform) {
      setEditableTexts(!editableTexts);
      return;
    }

    setEditableTexts(!editableTexts);

    if (editableTexts) {
      saveChanges(row.platform, platform, key);
    }
  };
  // Cancelar edición
  const handleCancelModifyText = () => {
    setEditableTexts(!editableTexts);

    setPlatform(row.platform);
    setKey(row.key);
  };

  return (
    <tr>
      {/* Columna 1 */}
      <td>
        {editableTexts ? (
          <input
            className="input-modify-platform"
            type="text"
            value={platform}
            onChange={(e) => handlePlatformChange(e.target.value)}
            required
          />
        ) : (
          <span>{platform}</span>
        )}
      </td>
      {/* Columna 2 */}
      <td>
        {editableTexts ? (
          <input
            className="input-modify-key"
            type={visiblePassword ? "text" : "password"}
            value={key}
            onChange={(e) => handleKeyChange(e.target.value)}
          />
        ) : visiblePassword ? (
          key
        ) : (
          key.replace(/./g, "*")
        )}
      </td>
      {/* Columna 3 */}
      <td>
        <img
          src={!visiblePassword ? visibleIcon : notVisibleIcon}
          onClick={() => setVisiblePassword(!visiblePassword)}
          className="eye_icon"
          alt={!visiblePassword ? "Eye visible icon" : "Eye not visible icon"}
        />
      </td>
      {/* Columna 4 */}
      {/* <td>
        <button
          className="btn-modify-password"
          onClick={() => handleModifyText()}
        >
          {editableTexts ? TEXTS.save.en : TEXTS.modify.en}
        </button>
        {editableTexts && (
          <button
            style={{ marginLeft: "50px" }}
            className="btn-modify-password"
            onClick={() => handleCancelModifyText()}
          >
            {TEXTS.cancel.en}
          </button>
        )}
      </td> */}
    </tr>
  );
};
