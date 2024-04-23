import React, { useState, useEffect } from "react";
import { getPlatforms } from "../../../services/firebase/database.js";
import { useAuth } from "../../../contexts/authContext/index.jsx";
import { TEXTS } from "../../../assets/locales/texts.js";
import visibleIcon from "./../../../assets/images/visible_icon.svg";
import notVisibleIcon from "./../../../assets/images/not_visible_icon.svg";
import chainLine from "./../../../assets/images/chain_line_blocks.svg";
import NewPasswordPupup from "../new_password/NewPasswordPopup.jsx";
import "./PasswordManager.css";
import "./../../buttons/Switch.css";

export default function PasswordManager() {
  const { currentUser } = useAuth();

  const [privateKey, setPrivateKey] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [isBlockView, setIsBlockView] = useState(true);
  const [isOpenNewPasswordPopup, setIsOpenNewPasswordPopup] = useState(false);
  const [data, setData] = useState([
    {
      // fila/bloque 1
      id: 1,
      platform: "Instagram",
      key: "********",
      timestamp: "2024-02-12 17:35:47",
      proofOfWork: "533",
    },
    {
      // fila/bloque 2
      id: 2,
      platform: "Twitter",
      key: "********",
      timestamp: "2024-02-12 17:35:47",
      proofOfWork: "22",
    },
    {
      // fila/bloque 3
      id: 3,
      platform: "Binance",
      key: "********",
      timestamp: "2024-02-12 17:35:47",
      proofOfWork: "1476",
    },
  ]);

  // Añadir un nuevo bloque/fila
  const handleOpenAddPasswordPopUp = () => {
    setIsOpenNewPasswordPopup(true);

    // setData((prevData) => [
    //   ...prevData,
    //   {
    //     platform: "Linkedin",
    //     id: data.length + 1,
    //     key: "********",
    //     timestamp: "2024-02-12 17:35:47",
    //     proofOfWork: "154",
    //   },
    // ]);
  };

  // Guardar los cambios editados en la variable data
  const handleSaveChanges = (id, platform, key) => {
    // Encuentra el objeto correspondiente por su id
    const updatedData = data.map((block) => {
      if (block.id === id) {
        return { ...block, platform: platform, key: key };
      }
      return block;
    });

    setData(updatedData);
  };

  const toggleSwitch = () => {
    setIsBlockView(!isBlockView);
  };

  const handleClosePopup = () => {
    setIsOpenNewPasswordPopup(false);
  };

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

  // Consultar las plataformas registradas
  useEffect(() => {
    getPlatforms(currentUser.uid)
      .then((platforms) => {
        // Guardar las plataformas
        setPlatforms(platforms);
      })
      .catch((error) => {
        // Manejar cualquier error de consulta
        console.log("Error al guardar las platafromas:", error);
      });
  }, []);

  // Verificar si hay una clave privada guardada en sessionStorage al cargar el componente
  useEffect(() => {
    const storedPrivateKey = sessionStorage.getItem("privateKey");
    if (storedPrivateKey) {
      setPrivateKey(storedPrivateKey);
    }
  }, []);

  return (
    <div className="password-manager">
      <h1>{TEXTS.myKeys.en}</h1>
      <div className="password-manager-container">
        {isBlockView ? (
          <PasswordManagerBlocks
            data={data}
            handleOpenAddPasswordPopUp={handleOpenAddPasswordPopUp}
            handleSaveChanges={handleSaveChanges}
          />
        ) : (
          <PasswordManagerTable
            data={data}
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
        />
      )}
    </div>
  );
}

const PasswordManagerBlocks = ({
  data,
  handleOpenAddPasswordPopUp,
  handleSaveChanges,
}) => {
  return (
    <section className="password-manager-block">
      <div className="blocks">
        {data.map((block, index) => (
          <div className="blocks-lines" key={index}>
            <PasswordBlock block={block} saveChanges={handleSaveChanges} />
            <img
              src={chainLine}
              className={
                index == data.length - 1 ? "invisible" : "chian_line_icon"
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
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [editableTexts, setEditableTexts] = useState(false);
  const [platform, setPlatform] = useState(block.platform);
  const [key, setKey] = useState(block.key);

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
    if (editableTexts && key == block.key && platform == block.platform) {
      setEditableTexts(!editableTexts);
      return;
    }

    setEditableTexts(!editableTexts);

    if (editableTexts) {
      console.log("Guardando...");
      saveChanges(block.id, platform, key);
    }
  };
  // Cancelar edición
  const handleCancelModifyText = () => {
    setEditableTexts(!editableTexts);

    setPlatform(block.platform);
    setKey(block.key);
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
          ) : (
            <span className="text-block-section">{key}</span>
          )}
          <img
            src={!visiblePassword ? visibleIcon : notVisibleIcon}
            onClick={() => setVisiblePassword(!visiblePassword)}
            className="eye_icon"
            alt={!visiblePassword ? "Eye visible icon" : "Eye not visible icon"}
          />
        </div>
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

const PasswordManagerTable = ({ data, handleSaveChanges }) => {
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
          {data.map((row, index) => (
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
      console.log("Guardando...");
      saveChanges(row.id, platform, key);
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
            type="text"
            value={key}
            onChange={(e) => handleKeyChange(e.target.value)}
          />
        ) : (
          key
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
      <td>
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
      </td>
    </tr>
  );
};