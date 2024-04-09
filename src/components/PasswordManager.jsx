import React, { useState, useEffect } from "react";
import { TEXTS } from "../assets/locales/texts.js";
import visibleIcon from "./../assets/images/visible_icon.svg";
import notVisibleIcon from "./../assets/images/not_visible_icon.svg";
import chainLine from "./../assets/images/chain_line_blocks.svg";
import "./PasswordManager.css";
import "./Switch.css";

export default function PasswordManager() {
  const [isBlockView, setIsBlockView] = useState(true);
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

  const toggleSwitch = () => {
    setIsBlockView(!isBlockView);
  };

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

  return (
    <div className="password-manager">
      <h1>{TEXTS.myKeys.en}</h1>
      <div className="password-manager-container">
        {isBlockView ? (
          <PasswordManagerBlocks data={data} setData={setData} />
        ) : (
          <PasswordManagerTable data={data} />
        )}
      </div>
      <label className="toggle-switch">
        <input type="checkbox" checked={isBlockView} onChange={toggleSwitch} />
        <span className="slider"></span>
      </label>
      <span className="text-switch">{TEXTS.blockView.en}</span>
    </div>
  );
}

const PasswordManagerBlocks = ({ data, setData }) => {
  // Añadir un nuevo bloque
  const handleAddPassword = () => {
    setData((prevData) => [
      ...prevData,
      {
        platform: "Linkedin",
        id: data.length + 1,
        key: "********",
        timestamp: "2024-02-12 17:35:47",
        proofOfWork: "154",
      },
    ]);
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
      <button onClick={handleAddPassword} className="btn-add-password">
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
              type="text"
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

const PasswordManagerTable = ({ data }) => {
  return (
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
          <PasswordRow key={index} row={row} />
        ))}
      </tbody>
    </table>
  );
};

const PasswordRow = ({ row }) => {
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [editablePassword, setEditablePassword] = useState(false);
  const [editedText, setEditedText] = useState(row.key);

  const handleTextChange = (text) => {
    setEditedText(text);
  };

  const modifyText = () => {
    setEditablePassword(!editablePassword);

    if (editablePassword) {
      console.log("Guardando...");
    }
  };

  return (
    <tr>
      {/* Columna 1 */}
      <td>{row.platform}</td>
      {/* Columna 2 */}
      <td>
        {editablePassword ? (
          <input
            type="text"
            value={editedText}
            onChange={(e) => handleTextChange(e.target.value)}
          />
        ) : (
          editedText
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
        <button className="btn-modify-password" onClick={() => modifyText()}>
          {editablePassword ? TEXTS.save.en : TEXTS.modify.en}
        </button>
      </td>
    </tr>
  );
};
