import React, { useState } from "react";
import { TEXTS } from "../assets/locales/texts.js";
import { Navigate } from "react-router-dom";
import { useAuth } from "./../contexts/authContext";
import Navbar from "../components/navbar/Navbar";
import LocatorBar from "../components/locator_bar/LocatorBar.jsx";
import hexagons2 from "./../assets/images/hexagons2.svg";
import copyIcon from "./../assets/images/copy_icon.svg";
import "./PasswordGenerator.css";

export default function PasswordGeneratorPage() {
  const { userLoggedIn } = useAuth();

  const [nameActiveSection, setNameActiveSection] = useState("Generator");
  const [passwordGenerated, setPasswordGenerated] = useState("Your password");
  const homeSections = TEXTS.homeSections.en;

  const handleGeneratePassword = () => {
    generateRandomPassword();
  };

  const handleCopyPassword = () => {
    navigator.clipboard
      .writeText(passwordGenerated)
      .then(() => {
        console.log("Contraseña copiada al portapapeles");
      })
      .catch((err) => {
        console.error("Error al copiar al portapapeles: ", err);
      });
  };

  const generateRandomPassword = () => {
    var randomstring = Math.random().toString(36).slice(-12);

    setPasswordGenerated(randomstring);
  };

  return (
    <div className="password-generator">
      {!userLoggedIn && <Navigate to={"../"} replace={true} />}
      <Navbar
        sections={homeSections}
        nameActiveSection={nameActiveSection}
        transmitter={TEXTS.home.en}
      />
      <div className="password-generator-section">
        <h1>{TEXTS.generateYourPassword.en}</h1>
        <div className="password-generator-container">
          <div className="text-generated">
            <span>{passwordGenerated}</span>
            <img
              onClick={handleCopyPassword}
              src={copyIcon}
              className="copy-icon"
              alt="Copy icon"
            />
          </div>
          <button
            onClick={handleGeneratePassword}
            className="btn-generate-password"
          >
            {TEXTS.generatePassword.en}
          </button>
        </div>
      </div>
      <section className="locator-bar">
        {homeSections.map((section, index) => (
          <LocatorBar
            key={index}
            section={section}
            nameActiveSection={nameActiveSection}
            index={index}
            lastIndex={index == homeSections.length - 1 ? true : false}
            transmitter={TEXTS.home.en}
          ></LocatorBar>
        ))}
      </section>
      <img
        src={hexagons2}
        className="hexagons2-background-managepage"
        alt="Background of hexagons"
      />
    </div>
  );
}
