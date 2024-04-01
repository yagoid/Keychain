import React, { useState } from "react";
import { TEXTS } from "../assets/locales/texts.js";
import Navbar from "../components/Navbar";
import MainButton from "../components/MainButton";
import LocatorBar from "../components/LocatorBar";
import hexagons2 from "./../assets/images/hexagons2.svg";
import "./Manage.css";

export default function ManagePage() {
  const [nameActiveSection, setNameActiveSection] = useState("Manage");
  const homeSections = TEXTS.homeSections.en;

  return (
    <div className="manage">
      <Navbar
        sections={homeSections}
        nameActiveSection={nameActiveSection}
        transmitter={TEXTS.home.en}
      />
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
        className="hexagons2-background"
        alt="Background of hexagons"
      />
    </div>
  );
}
