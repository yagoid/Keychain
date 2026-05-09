import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doSignOut } from "../../services/firebase/auth.js";
import { TEXTS } from "../../assets/locales/texts.js";
import MainButton from "../buttons/MainButton.jsx";
import "./Navbar.css";

export default function Navbar({
  setActiveSection,
  sections,
  nameActiveSection,
  transmitter,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [prevScrollPosition, setPrevScrollPosition] = useState(0);

  const navigate = useNavigate();

  const navigateToSection = (index) => {
    if (setActiveSection) setActiveSection(index);
    setIsMenuOpen(false);
  };
  const navigateToMain = () => setActiveSection && setActiveSection(0);
  const handleSignOut = () => {
    doSignOut().then(() => navigate("/"));
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPosition = window.scrollY;
      setScrollDirection(currentScrollPosition > prevScrollPosition ? "down" : "up");
      setPrevScrollPosition(currentScrollPosition);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPosition]);

  const navState =
    prevScrollPosition !== 0
      ? scrollDirection === "up"
        ? "pb-nav--show pb-nav--scrolled"
        : "pb-nav--hide"
      : "pb-nav--top";

  return (
    <nav className={`pb-nav ${navState} ${isMenuOpen ? "pb-nav--open" : ""}`}>
      <div className="pb-nav__inner">
        {/* brand */}
        <div className="pb-nav__brand">
          <Link
            to={transmitter === TEXTS.home.en ? "/home" : "/"}
            onClick={transmitter === TEXTS.about.en ? navigateToMain : null}
            className="pb-nav__logo"
            aria-label="Keychain home"
          >
            <svg
              className="pb-nav__logo-svg"
              width="22"
              height="22"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
            >
              <rect x="2.5" y="9.5" width="11" height="11" rx="1" stroke="currentColor" strokeWidth="1.4" />
              <rect x="10.5" y="5.5" width="11" height="11" rx="1" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
              <rect x="18.5" y="13.5" width="11" height="11" rx="1" stroke="var(--plasma)" strokeWidth="1.4" />
              <line x1="8" y1="15" x2="13" y2="15" stroke="var(--plasma)" strokeWidth="1.2" />
              <line x1="16" y1="11" x2="21" y2="11" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
              <circle cx="24" cy="19" r="1.4" fill="var(--plasma)" />
            </svg>
            <span className="pb-nav__logo-word">
              KEY<span className="pb-nav__logo-sep">/</span>CHAIN
            </span>
          </Link>
          <span className="pb-nav__coord">// V.014</span>
        </div>

        {/* hamburger */}
        <button
          className="pb-nav__menu-btn"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((s) => !s)}
        >
          <span /><span /><span />
        </button>

        {/* sections */}
        <ul className={`pb-nav__list ${isMenuOpen ? "pb-nav__list--open" : ""}`}>
          {sections.map((section, index) => {
            if (section === TEXTS.main.en || section === TEXTS.home.en) return null;
            const isActive = section === nameActiveSection;
            return (
              <li key={index} className="pb-nav__item">
                <Link
                  to={transmitter === TEXTS.home.en ? `/${section.toLowerCase()}` : "#"}
                  onClick={() => navigateToSection(index)}
                  className={`pb-nav__link ${isActive ? "pb-nav__link--active" : ""}`}
                >
                  <span className="pb-nav__link-dot" aria-hidden="true" />
                  <span className="pb-nav__link-num">
                    {String(index).padStart(2, "0")}
                  </span>
                  <span className="pb-nav__link-text">{section}</span>
                </Link>
              </li>
            );
          })}
          {isMenuOpen && (
            <li className="pb-nav__cta-mobile">
              <NavCTA transmitter={transmitter} handleSignOut={handleSignOut} />
            </li>
          )}
        </ul>

        {/* desktop CTA */}
        <div className="pb-nav__cta">
          <NavCTA transmitter={transmitter} handleSignOut={handleSignOut} />
        </div>
      </div>
    </nav>
  );
}

const NavCTA = ({ transmitter, handleSignOut }) => {
  if (transmitter === TEXTS.about.en) {
    return <MainButton text={TEXTS.logIn.en} color="blue" route="/login" />;
  }
  return (
    <button onClick={handleSignOut} className="pb-nav__signout">
      <span>{TEXTS.logOut.en}</span>
      <span className="pb-nav__signout-arrow" aria-hidden="true">↗</span>
    </button>
  );
};
