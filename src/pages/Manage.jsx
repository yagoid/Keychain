import React, { useState, useEffect } from "react";
import { TEXTS } from "../assets/locales/texts.js";
import { Navigate } from "react-router-dom";
import { useAuth } from "./../contexts/authContext";
import Navbar from "../components/Navbar";
import LocatorBar from "../components/LocatorBar";
import hexagons2 from "./../assets/images/hexagons2.svg";
import "./Manage.css";
import ManageAccess from "../components/ManageAccess.jsx";
import PasswordManager from "../components/PasswordManager.jsx";

export default function ManagePage() {
  const { userLoggedIn } = useAuth();

  const [nameActiveSection, setNameActiveSection] = useState("Manage");
  const [isPrivateKeyValid, setIsPrivateKeyValid] = useState(false);

  const homeSections = TEXTS.homeSections.en;

  useEffect(() => {
    // Verificar si hay una clave privada guardada en sessionStorage al cargar el componente
    const storedPrivateKey = sessionStorage.getItem("privateKey");
    if (storedPrivateKey) {
      setIsPrivateKeyValid(true);
    }

    console.log(storedPrivateKey);
  }, []);

  return (
    <div className={isPrivateKeyValid ? "manage-password" : "manage-access"}>
      {!userLoggedIn && <Navigate to={"../"} replace={true} />}
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
          <ManageAccess setIsPrivateKeyValid={setIsPrivateKeyValid} />
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
