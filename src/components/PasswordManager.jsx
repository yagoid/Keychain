import React, { useState } from "react";
import { TEXTS } from "../assets/locales/texts.js";
import "./PasswordManager.css";

export default function PasswordManager() {
  const data = [
    {
      columna1: "Instagram",
      columna2: "********",
      columna3: "Dato 1C",
      columna4: "Modify",
    },
    {
      columna1: "Twitter",
      columna2: "********",
      columna3: "Dato 2C",
      columna4: "Modify",
    },
    {
      columna1: "Binance",
      columna2: "********",
      columna3: "Dato 3C",
      columna4: "Modify",
    },
  ];

  return (
    <div className="password-manager">
      <h1>{TEXTS.myKeys.en}</h1>
      <div className="password-manager-container">
        <table className="password-manager-table">
          <colgroup>
            <col style={{ width: "35%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "25%" }} />
          </colgroup>
          <thead>
            <tr>
              <th className="column-tittle">{TEXTS.platform.en}</th>
              <th className="column-tittle">{TEXTS.password.en}</th>
              <th className="column-tittle"></th>
              <th className="column-tittle">
                <button>{TEXTS.addPassword.en}</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.columna1}</td>
                <td>{row.columna2}</td>
                <td>
                  <Icono />
                </td>
                <td>
                  <button>{row.columna4}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const Icono = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
};
