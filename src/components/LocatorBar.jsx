import LocatorSquareActive from "./../assets/images/locator_square_active.svg";
import LocatorSquareActiveGreen from "./../assets/images/locator_square_active_green.svg";
import LocatorSquare from "./../assets/images/locator_square.svg";
import LocatorLine from "./../assets/images/locator_line.svg";
import "./LocatorBar.css";

export default function LocationBar({
  setActiveSection,
  section,
  nameActiveSection,
  index,
  lastIndex,
}) {
  const changeActiveSection = () => {
    setActiveSection(index);
  };

  return (
    <>
      <div className="icon-set">
        <img
          onClick={changeActiveSection}
          src={
            nameActiveSection === section
              ? section === "Main"
                ? LocatorSquareActive
                : LocatorSquareActiveGreen
              : LocatorSquare
          }
          className="locator-square"
          alt="Locator square"
        />
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
    </>
  );
}
