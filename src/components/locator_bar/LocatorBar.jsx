import { TEXTS } from "../../assets/locales/texts.js";
import { Link } from "react-router-dom";
import "./LocatorBar.css";

export default function LocatorBar({
  setActiveSection,
  section,
  nameActiveSection,
  index,
  transmitter,
}) {
  const isActive = nameActiveSection === section;
  const label = String(index).padStart(2, "0");

  const handleClick = () => {
    if (setActiveSection) setActiveSection(index);
  };

  const inner = (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Go to section ${section}`}
      className={`pb-loc__item ${isActive ? "pb-loc__item--active" : ""}`}
    >
      <span className="pb-loc__num">{label}</span>
      <span className="pb-loc__dot" aria-hidden="true" />
    </button>
  );

  if (transmitter === TEXTS.home.en) {
    return (
      <Link to={`/${section.toLowerCase()}`} className="pb-loc__link">
        {inner}
      </Link>
    );
  }

  return inner;
}
