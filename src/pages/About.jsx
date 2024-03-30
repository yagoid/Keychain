import React, { useState, useRef, useEffect } from "react";
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
import Footer from "../components/Footer.jsx";

export default function AboutPage() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [nameActiveSection, setNameActiveSection] = useState("Main");

  const aboutRef = useRef(null);
  const mainRef = useRef(null);
  const solutionsRef = useRef(null);
  const servicesRef = useRef(null);
  const foundersRef = useRef(null);

  const aboutSections = TEXTS.aboutSections.en;
  let positionSolutionsSection = 0;
  let positionServicesSection = 0;
  let positionFoundersSection = 0;

  // Scroll to section clicked on NavBar or LocatorBar
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    if (activeSection === 0) {
      scrollToSection(mainRef);
    } else if (activeSection === 1) {
      scrollToSection(solutionsRef);
    } else if (activeSection === 2) {
      scrollToSection(servicesRef);
    } else if (activeSection === 3) {
      scrollToSection(foundersRef);
    }
  }, [activeSection]);

  // Know the sections where user is
  const handleScroll = () => {
    if (solutionsRef.current) {
      const { offsetTop } = solutionsRef.current;
      positionSolutionsSection = offsetTop;
    }
    if (servicesRef.current) {
      const { offsetTop } = servicesRef.current;
      positionServicesSection = offsetTop;
    }
    if (foundersRef.current) {
      const { offsetTop } = foundersRef.current;
      positionFoundersSection = offsetTop;
    }

    const position = window.scrollY;
    setScrollPosition(position);
    // console.log("Scroll position", scrollPosition);

    // console.log("solutions", positionSolutionsSection);
    // console.log("services", positionServicesSection);
    // console.log("funders", positionFoundersSection);

    if (
      scrollPosition < positionSolutionsSection - 50 &&
      nameActiveSection != TEXTS.main.en
    ) {
      setNameActiveSection(TEXTS.main.en);
      setActiveSection(-1);
    } else if (
      scrollPosition >= positionSolutionsSection - 50 &&
      scrollPosition < positionServicesSection - 50 &&
      nameActiveSection != TEXTS.solutions.en
    ) {
      setNameActiveSection(TEXTS.solutions.en);
      setActiveSection(-1);
    } else if (
      scrollPosition >= positionServicesSection - 50 &&
      scrollPosition < positionFoundersSection - 150 &&
      nameActiveSection != TEXTS.services.en
    ) {
      setNameActiveSection(TEXTS.services.en);
      setActiveSection(-1);
    } else if (
      scrollPosition >= positionFoundersSection - 150 &&
      nameActiveSection != TEXTS.founders.en
    ) {
      setNameActiveSection(TEXTS.founders.en);
      setActiveSection(-1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollPosition]);

  return (
    <div className="about" ref={aboutRef}>
      <div id="main" className="main-section" ref={mainRef}>
        <Navbar
          setActiveSection={setActiveSection}
          sections={aboutSections}
          nameActiveSection={nameActiveSection}
        />
        {/* <a href="/home">Ir al home</a> */}
        <div className="main-content">
          <MainText />
          <MainButton text={TEXTS.start.en} color={"blue"} route={"/login"} />
        </div>
        <img
          src={hexagons1}
          className="hexagons1-background"
          alt="Background of hexagons"
        />
        <section className="locator-bar">
          {aboutSections.map((section, index) => (
            <LocatorBar
              key={index}
              setActiveSection={setActiveSection}
              section={section}
              nameActiveSection={nameActiveSection}
              index={index}
              lastIndex={index == aboutSections.length - 1 ? true : false}
            ></LocatorBar>
          ))}
        </section>
      </div>
      <div id="solutions" className="solutions-section" ref={solutionsRef}>
        <SolutionsContent />
      </div>
      <div id="services" className="services-section" ref={servicesRef}>
        <ServicesContent />
      </div>
      <div id="founders" className="founders-section" ref={foundersRef}>
        <FoundersContent />
      </div>
      <Footer />
    </div>
  );
}
