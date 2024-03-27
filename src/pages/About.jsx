import { useState } from "react";
import "./About.css";
import { TEXTS } from "./../assets/locales/texts.js";
import hexagons1 from "./../assets/images/hexagons1.svg";
import MainButton from "../components/MainButton";
import MainText from "../components/MainText";
import Navbar from "../components/Navbar";
import LocatorBar from "../components/LocatorBar";
import SolutionsContent from "../components/SolutionsContent.jsx";
import ServicesContent from "../components/ServicesContent.jsx";
import FoundersContent from "../components/FoundersContent.jsx";

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState(0);
  const aboutSections = TEXTS.aboutSections.en;
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
            <MainButton text={TEXTS.start.en} color={"blue"} />
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
          <SolutionsContent />
        </div>
        <div className="services-section">
          <ServicesContent />
        </div>
        <div className="founders-section">
          <FoundersContent />
        </div>
      </div>
    </>
  );
}
