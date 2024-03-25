import logo from "./../assets/logo_keychain.svg";
import NavbarMenu from "./../assets/navbar_menu.svg";
import MainButton from "./MainButton";
import { useState } from "react";
import "./Navbar.css";

export default function () {
  const [navLinkActive, setNavLinkActive] = useState("none");
  const [isMenuOpen, setisMenuOpen] = useState(false);

  const navigateToSolutions = () => {
    setNavLinkActive("solutions");
  };
  const navigateToServices = () => {
    setNavLinkActive("services");
  };
  const navigateToFounders = () => {
    setNavLinkActive("founders");
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
          <a onClick={navigateToSolutions} href="#solutions">
            <img src={logo} className="logo" alt="keychain's logo" />
          </a>
        </div>
        <ul className={isMenuOpen ? "navbar open" : "navbar"}>
          <li>
            <a
              onClick={navigateToSolutions}
              className={navLinkActive == "solutions" ? "active" : ""}
              href="#solutions"
            >
              Solutions
            </a>
          </li>
          <li>
            <a
              onClick={navigateToServices}
              className={navLinkActive == "services" ? "active" : ""}
              href="#services"
            >
              Services
            </a>
          </li>
          <li>
            <a
              onClick={navigateToFounders}
              className={navLinkActive == "founders" ? "active" : ""}
              href="#founders"
            >
              Founders
            </a>
          </li>
        </ul>
        <div className="login-button">
          <MainButton text="Log In" />
        </div>
      </nav>
    </>
  );
}
