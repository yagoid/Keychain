import React, { useState } from "react";
import { TEXTS } from "../assets/locales/texts.js";
import Navbar from "../components/Navbar";
import MainButton from "../components/MainButton";
import LocatorBar from "../components/LocatorBar";
import hexagons2 from "./../assets/images/hexagons2.svg";
import "./Manage.css";
import ManageAccess from "../components/ManageAccess.jsx";
import PasswordManager from "../components/PasswordManager.jsx";

export default function ManagePage() {
  const [nameActiveSection, setNameActiveSection] = useState("Manage");
  const [isPrivateKeyValid, setIsPrivateKeyValid] = useState(true);

  const homeSections = TEXTS.homeSections.en;

  return (
    <div className={isPrivateKeyValid ? "manage-password" : "manage-access"}>
      <Navbar
        sections={homeSections}
        nameActiveSection={nameActiveSection}
        transmitter={TEXTS.home.en}
      />
      {isPrivateKeyValid ? (
        <div className="password-manager-section">
          <PasswordManager />
        </div>
      ) : (
        <div className="access-section">
          <ManageAccess />
        </div>
      )}
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
