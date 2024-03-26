import { useState } from "react";
import hexagons1 from "./../assets/hexagons1.svg";
import MainButton from "../components/MainButton";
import MainText from "../components/MainText";
import Navbar from "../components/Navbar";
import "./About.css";
import LocatorBar from "../components/LocatorBar";

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState(0);
  const aboutSections = ["Solutions", "Services", "Founders"];
  const numSections = 4;

  return (
    <>
      <div className="about">
        <div className="main-section">
          <Navbar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            sections={aboutSections}
          />
          {/* <a href="/home">Ir al home</a> */}
          <div className="main-content">
            <MainText />
            <MainButton text="Start" />
          </div>
          <img
            src={hexagons1}
            className="hexagons1-background"
            alt="Background of hexagons"
          />
          <section className="locator-bar">
            {Array.from({ length: numSections }).map((_, index) => (
              <LocatorBar
                key={index}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                index={index}
                lastIndex={index == numSections - 1 ? true : false}
              ></LocatorBar>
            ))}
          </section>
        </div>
        <div className="solutions-section">
          <div className="solutions-tittle">
            <h1 className="section-tittle">
              <span></span>Solutions
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}
