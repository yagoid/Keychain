import React, { useState, useRef, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./../contexts/authContext";
import { TEXTS } from "./../assets/locales/texts.js";
import "./About.css";
import hexagons1 from "./../assets/images/hexagons1.svg";
import MainButton from "../components/buttons/MainButton.jsx";
import MainText from "../components/texts/MainText.jsx";
import Navbar from "../components/navbar/Navbar";
import LocatorBar from "../components/locator_bar/LocatorBar.jsx";
import SolutionsContent from "../components/about/SolutionsContent.jsx";
import ServicesContent from "../components/about/ServicesContent.jsx";
import FoundersContent from "../components/about/FoundersContent.jsx";
import Footer from "../components/footer/Footer.jsx";

export default function AboutPage() {
  const { userLoggedIn } = useAuth();

  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [nameActiveSection, setNameActiveSection] = useState(TEXTS.main.en);

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
      {userLoggedIn && <Navigate to={"../home"} replace={true} />}
      <div id="main" className="main-section" ref={mainRef}>
        <Navbar
          setActiveSection={setActiveSection}
          sections={aboutSections}
          nameActiveSection={nameActiveSection}
          transmitter={TEXTS.about.en}
        />
        {/* <Link to="/home">Ir al home</Link> */}
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
              transmitter={TEXTS.about.en}
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
