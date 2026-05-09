import React, { useState, useRef, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./../contexts/authContext";
import { TEXTS } from "./../assets/locales/texts.js";
import whitepaper from "../assets/docs/memoria__keychain.pdf";
import "./About.css";
import MainButton from "../components/buttons/MainButton.jsx";
import MainText from "../components/texts/MainText.jsx";
import Navbar from "../components/navbar/Navbar";
import LocatorBar from "../components/locator_bar/LocatorBar.jsx";
import SolutionsContent from "../components/about/SolutionsContent.jsx";
import ServicesContent from "../components/about/ServicesContent.jsx";
import Footer from "../components/footer/Footer.jsx";
import Backdrop from "../components/ui/Backdrop.jsx";

/* Live block ticker */
function LiveTicker() {
  const [block, setBlock] = useState({ n: 14092, hash: '0x9a4c1f...88d2' });
  useEffect(() => {
    const id = setInterval(() => {
      const r = () => Math.floor(Math.random() * 16).toString(16);
      const h = '0x' + Array.from({ length: 6 }, r).join('') + '...' + Array.from({ length: 4 }, r).join('');
      setBlock(b => ({ n: b.n + 1, hash: h }));
    }, 4200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="about__ticker">
      <span className="about__ticker-live">
        <span className="about__ticker-dot" />
        LEDGER · LIVE
      </span>
      <span className="about__ticker-sep">|</span>
      <span>BLOCK #{block.n.toLocaleString()}</span>
      <span className="about__ticker-sep">|</span>
      <span className="about__ticker-hash">{block.hash}</span>
    </div>
  );
}

/* Corner cross-hair marks */
function CornerMark({ pos }) {
  return <div className={`about__corner about__corner--${pos}`} aria-hidden="true" />;
}

export default function AboutPage() {
  const { userLoggedIn } = useAuth();

  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [nameActiveSection, setNameActiveSection] = useState(TEXTS.main.en);

  const aboutRef = useRef(null);
  const mainRef = useRef(null);
  const solutionsRef = useRef(null);
  const servicesRef = useRef(null);

  const aboutSections = TEXTS.aboutSections.en.filter(
    (s) => s !== TEXTS.founders.en
  );
  let positionSolutionsSection = 0;
  let positionServicesSection = 0;

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    if (activeSection === 0) scrollToSection(mainRef);
    else if (activeSection === 1) scrollToSection(solutionsRef);
    else if (activeSection === 2) scrollToSection(servicesRef);
  }, [activeSection]);

  const handleScroll = () => {
    if (solutionsRef.current) positionSolutionsSection = solutionsRef.current.offsetTop;
    if (servicesRef.current) positionServicesSection = servicesRef.current.offsetTop;

    const position = window.scrollY;
    setScrollPosition(position);

    if (scrollPosition < positionSolutionsSection - 50 && nameActiveSection !== TEXTS.main.en) {
      setNameActiveSection(TEXTS.main.en);
      setActiveSection(-1);
    } else if (
      scrollPosition >= positionSolutionsSection - 50 &&
      scrollPosition < positionServicesSection - 50 &&
      nameActiveSection !== TEXTS.solutions.en
    ) {
      setNameActiveSection(TEXTS.solutions.en);
      setActiveSection(-1);
    } else if (scrollPosition >= positionServicesSection - 50 && nameActiveSection !== TEXTS.services.en) {
      setNameActiveSection(TEXTS.services.en);
      setActiveSection(-1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollPosition]);

  return (
    <div className="about" ref={aboutRef}>
      {userLoggedIn && <Navigate to={"../home"} replace={true} />}

      <Navbar
        setActiveSection={setActiveSection}
        sections={aboutSections}
        nameActiveSection={nameActiveSection}
        transmitter={TEXTS.about.en}
      />

      <aside className="about__locator" aria-label="Page sections">
        {aboutSections.map((section, index) => (
          <LocatorBar
            key={index}
            setActiveSection={setActiveSection}
            section={section}
            nameActiveSection={nameActiveSection}
            index={index}
            lastIndex={index === aboutSections.length - 1}
            transmitter={TEXTS.about.en}
          />
        ))}
      </aside>

      {/* HERO ============================================ */}
      <section id="main" className="about__hero" ref={mainRef}>
        <Backdrop variant="mesh" intensity={0.55} />

        <CornerMark pos="tl" />
        <CornerMark pos="tr" />
        <CornerMark pos="bl" />
        <CornerMark pos="br" />

        <aside className="about__hero-rail" aria-hidden="true">
          SECURITY PROTOCOL · SHA-256 · MMXXVI
        </aside>

        <div className="about__hero-inner">
          <div className="about__hero-eyebrow">
            [ 00 — DECENTRALIZED VAULT // EST. MMXXIV ]
          </div>

          <MainText />

          <div className="about__hero-cta">
            <MainButton text="$ initialize_vault" color={"blue"} route={"/login"} />
            <a
              href={whitepaper}
              target="_blank"
              rel="noreferrer"
              className="about__ghost-btn"
            >
              <span className="about__ghost-comment">//</span> read whitepaper
            </a>
          </div>

          <div className="about__hero-chrome">
            <LiveTicker />
            <div className="about__hero-stats">
              ↳ <span>14,092</span> blocks · <span>2,481</span> nodes · <span>0</span> breaches
            </div>
          </div>
        </div>

      </section>

      {/* SOLUTIONS ====================================== */}
      <section id="solutions" className="about__section" ref={solutionsRef}>
        <SolutionsContent />
      </section>

      {/* SERVICES ======================================= */}
      <section id="services" className="about__section about__section--alt" ref={servicesRef}>
        <ServicesContent />
      </section>

      <Footer />
    </div>
  );
}
