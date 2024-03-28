import { useState, useEffect } from "react";
import Logo from "./../assets/images/logo_keychain.svg";
import NavbarMenu from "./../assets/images/navbar_menu.svg";
import MainButton from "./MainButton";
import { TEXTS } from "./../assets/locales/texts.js";
import "./Navbar.css";

export default function Navbar({
  setActiveSection,
  sections,
  nameActiveSection,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [prevScrollPosition, setPrevScrollPosition] = useState(0);

  const navigateToSection = (index) => {
    setActiveSection(index);
  };
  const navigateToMain = () => {
    setActiveSection(0);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPosition = window.scrollY;

      if (currentScrollPosition > prevScrollPosition) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }

      setPrevScrollPosition(currentScrollPosition);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPosition]);

  return (
    <>
      <nav
        className={
          prevScrollPosition != 0
            ? scrollDirection === "up"
              ? "nav-appear"
              : "nav-disappear"
            : "top-nav"
        }
      >
        <div className="icons">
          <img
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="icon-menu"
            src={NavbarMenu}
            alt="NavBar Menu"
          />
          <a onClick={navigateToMain}>
            <img src={Logo} className="logo" alt="keychain's logo" />
          </a>
        </div>
        <ul className={isMenuOpen ? "navbar open" : "navbar"}>
          {sections.map(
            (section, index) =>
              section != TEXTS.main.en && (
                <li key={index}>
                  <a
                    onClick={() => navigateToSection(index)}
                    className={section === nameActiveSection ? "active" : ""}
                    // href={`#${section.toLowerCase()}`}
                  >
                    {section}
                  </a>
                </li>
              )
          )}
        </ul>
        <div className="login-button">
          <MainButton text={TEXTS.logIn.en} color={"blue"} />
        </div>
      </nav>
    </>
  );
}
