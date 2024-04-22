import { TEXTS } from "../../assets/locales/texts.js";
import LocatorSquareActive from "./../../assets/images/locator_square_active.svg";
import LocatorSquareActiveGreen from "./../../assets/images/locator_square_active_green.svg";
import LocatorSquare from "./../../assets/images/locator_square.svg";
import LocatorLine from "./../../assets/images/locator_line.svg";
import "./LocatorBar.css";
import { Link } from "react-router-dom";

export default function LocationBar({
  setActiveSection,
  section,
  nameActiveSection,
  index,
  lastIndex,
  transmitter,
}) {
  const changeActiveSection = () => {
    setActiveSection(index);
  };

  return (
    <div className="icon-set">
      <Link
        to={transmitter === TEXTS.home.en ? `/${section.toLowerCase()}` : null}
      >
        <img
          onClick={setActiveSection ? changeActiveSection : null}
          src={
            nameActiveSection === section
              ? section === TEXTS.main.en || section === TEXTS.home.en
                ? LocatorSquareActive
                : LocatorSquareActiveGreen
              : LocatorSquare
          }
          className="locator-square"
          alt="Locator square"
        />
      </Link>
      {!lastIndex && (
        <img
          src={LocatorLine}
          className={
            index === 0 ? "locator-line invisible-line" : "locator-line"
          }
          alt="Locator square"
        />
      )}
    </div>
  );
}
