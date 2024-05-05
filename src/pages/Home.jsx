import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "./../contexts/authContext";
import { TEXTS } from "../assets/locales/texts.js";
import Navbar from "../components/navbar/Navbar";
import LocatorBar from "../components/locator_bar/LocatorBar.jsx";
import hexagons2 from "./../assets/images/hexagons2.svg";
import "./Home.css";

export default function HomePage() {
  const { userLoggedIn } = useAuth();

  const [nameActiveSection, setNameActiveSection] = useState(TEXTS.home.en);
  const homeSections = TEXTS.homeSections.en;

  return (
    <div className="home">
      {!userLoggedIn && <Navigate to={"../"} replace={true} />}
      <Navbar
        sections={homeSections}
        nameActiveSection={nameActiveSection}
        transmitter={TEXTS.home.en}
      />
      <div className="home-texts">
        <div className="text-and-button">
          <div className="first-home-text">
            <span>{TEXTS.keychain.en}</span>
            <span>{TEXTS.homeText.en}</span>
          </div>
          <div className="buttons">
            <Link className="btn-my-passwords" to={"/manage"}>
              {TEXTS.myPasswords.en}
            </Link>
            {/* <MainButton
              text={TEXTS.generator.en}
              color={"grey"}
              route={"/generator"}
            /> */}
          </div>
        </div>
        <div className="second-home-text">
          <span>{TEXTS.approximately.en}</span>
          <span>{TEXTS.approximatelyNumber.en}</span>
          <span>{TEXTS.approximatelyText.en}</span>
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
        className="hexagons2-background"
        alt="Background of hexagons"
      />
    </div>
  );
}
