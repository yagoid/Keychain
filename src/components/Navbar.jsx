import Logo from "./../assets/logo_keychain.svg";
import NavbarMenu from "./../assets/navbar_menu.svg";
import MainButton from "./MainButton";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar({ activeSection, setActiveSection, sections }) {
  const [isMenuOpen, setisMenuOpen] = useState(false);

  const navigateToSection = (index) => {
    setActiveSection(index);
  };
  const navigateToMain = () => {
    setActiveSection(0);
  };

  return (
    <>
      <nav>
        <div className="icons">
          <img
            onClick={() => setisMenuOpen(!isMenuOpen)}
            className="icon-menu"
            src={NavbarMenu}
            alt="NavBar Menu"
          />
          <a onClick={navigateToMain} href="#solutions">
            <img src={Logo} className="logo" alt="keychain's logo" />
          </a>
        </div>
        <ul className={isMenuOpen ? "navbar open" : "navbar"}>
          {sections.map((section, index) => (
            <li key={index}>
              <a
                onClick={() => navigateToSection(index + 1)}
                className={activeSection === index + 1 ? "active" : ""}
                href={`#${section.toLowerCase()}`}
              >
                {section}
              </a>
            </li>
          ))}
        </ul>
        <div className="login-button">
          <MainButton text="Log In" />
        </div>
      </nav>
    </>
  );
}
