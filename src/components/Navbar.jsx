import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./../contexts/authContext";
import { doSignOut } from "../services/firebase/auth";
import { TEXTS } from "./../assets/locales/texts.js";
import KeychainIcon from "./../assets/images/keychain.svg";
import NavbarMenu from "./../assets/images/navbar_menu.svg";
import MainButton from "./MainButton";
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
    setActiveSection(index);
  };
  const navigateToMain = () => {
    setActiveSection(0);
  };
  const handleSignOut = () => {
    doSignOut().then(() => {
      navigate("/");
    });
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
          <Link
            onClick={transmitter === TEXTS.about.en ? navigateToMain : null}
            to={transmitter === TEXTS.home.en ? "/home" : null}
          >
            <img src={KeychainIcon} className="logo" alt="keychain's logo" />
          </Link>
        </div>
        <ul className={isMenuOpen ? "navbar open" : "navbar"}>
          {sections.map(
            (section, index) =>
              section != TEXTS.main.en &&
              section != TEXTS.home.en && (
                <li key={index}>
                  <Link
                    onClick={() => navigateToSection(index)}
                    className={section === nameActiveSection ? "active" : ""}
                    to={
                      transmitter === TEXTS.home.en
                        ? `/${section.toLowerCase()}`
                        : null
                    }
                  >
                    {section}
                  </Link>
                </li>
              )
          )}
          {isMenuOpen && (
            <div className="nav-button-open">
              <NavButtton
                transmitter={transmitter}
                handleSignOut={handleSignOut}
              />
            </div>
          )}
        </ul>
        <div className="nav-button">
          <NavButtton transmitter={transmitter} handleSignOut={handleSignOut} />
        </div>
      </nav>
    </>
  );
}

const NavButtton = ({ transmitter, handleSignOut }) => {
  return (
    <div>
      {transmitter === TEXTS.about.en ? (
        <div className="login-button">
          <MainButton text={TEXTS.logIn.en} color={"blue"} route={"/login"} />
        </div>
      ) : (
        <div className="logout-button" onClick={handleSignOut}>
          <Link to="/">{TEXTS.logOut.en}</Link>
        </div>
      )}
    </div>
  );
};
