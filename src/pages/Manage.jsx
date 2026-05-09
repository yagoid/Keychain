import React, { useState, useEffect } from "react";
import { TEXTS } from "../assets/locales/texts.js";
import { Navigate } from "react-router-dom";
import { useAuth } from "./../contexts/authContext";
import { useKey } from "./../contexts/keyContext/keyContext";
import Navbar from "../components/navbar/Navbar";
import LocatorBar from "../components/locator_bar/LocatorBar.jsx";
import "./Manage.css";
import ManageAccess from "../components/manage/manage_access/ManageAccess.jsx";
import PasswordManager from "../components/manage/password_manager/PasswordManager.jsx";

export default function ManagePage() {
  const { userLoggedIn } = useAuth();
  const { contextPrivateKey } = useKey();

  const [nameActiveSection] = useState("Manage");
  const [isPrivateKeyValid, setIsPrivateKeyValid] = useState(false);

  const homeSections = TEXTS.homeSections.en;

  useEffect(() => {
    const storedPrivateKey = sessionStorage.getItem("privateKey");
    if (storedPrivateKey || contextPrivateKey != "") {
      setIsPrivateKeyValid(true);
    }
  }, []);

  return (
    <div className="vault">
      {!userLoggedIn && <Navigate to={"../"} replace={true} />}
      <Navbar
        sections={homeSections}
        nameActiveSection={nameActiveSection}
        transmitter={TEXTS.home.en}
      />

      <aside className="vault__locator" aria-label="Sections">
        {homeSections.map((section, index) => (
          <LocatorBar
            key={index}
            section={section}
            nameActiveSection={nameActiveSection}
            index={index}
            lastIndex={index == homeSections.length - 1}
            transmitter={TEXTS.home.en}
          />
        ))}
      </aside>

      <main className="vault__main">
        {isPrivateKeyValid ? (
          <PasswordManager />
        ) : (
          <ManageAccess setIsPrivateKeyValid={setIsPrivateKeyValid} />
        )}
      </main>
    </div>
  );
}
