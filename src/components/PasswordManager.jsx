import React, { useState } from "react";
import { TEXTS } from "../assets/locales/texts.js";
import visibleIcon from "./../assets/images/visible_icon.svg";
import notVisibleIcon from "./../assets/images/not_visible_icon.svg";
import "./PasswordManager.css";

export default function PasswordManager() {
  const data = [
    {
      // fila 1
      columna1: "Instagram",
      columna2: "********",
      columna3: "Eye",
      columna4: "Modify",
    },
    {
      // fila 2
      columna1: "Twitter",
      columna2: "********",
      columna3: "Eye",
      columna4: "Modify",
    },
    {
      // fila 3
      columna1: "Binance",
      columna2: "********",
      columna3: "Eye",
      columna4: "Modify",
    },
  ];

  return (
    <div className="password-manager">
      <h1>{TEXTS.myKeys.en}</h1>
      <div className="password-manager-container">
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
                <button className="btn-add-password">
                  {TEXTS.addPassword.en}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <PasswordRow key={index} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const PasswordRow = (row) => {
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [editablePassword, setEditablePassword] = useState(false);
  const [editedText, setEditedText] = useState(row.row.columna2);

  const handleTextChange = (text) => {
    setEditedText(text);
  };

  return (
    <tr>
      {/* Columna 1 */}
      <td>{row.row.columna1}</td>
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
        <button
          className="btn-modify-password"
          onClick={() => setEditablePassword(!editablePassword)}
        >
          {editablePassword ? TEXTS.save.en : TEXTS.modify.en}
        </button>
      </td>
    </tr>
  );
};
