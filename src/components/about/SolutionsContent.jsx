import { TEXTS } from "./../../assets/locales/texts.js";
import SecureIcon from "./../../assets/images/secure_icon.svg";
import GearIcon from "./../../assets/images/gear_icon.svg";
import FlowIcon from "./../../assets/images/flow_icon.svg";
import "./SolutionsContent.css";

const SolutionsParagraph = ({ tittle, text, icon }) => {
  return (
    <div className="solutions-paragraph">
      <div className="icon-tittle">
        <img src={icon} className="icon-paragraph" alt="Locator square" />
        <p className="tittle-paragraph">{tittle}</p>
      </div>
      <p className="text-paragraph">{text}</p>
    </div>
  );
};

export default function SolutionsContent() {
  return (
    <>
      <div className="solutions-tittle">
        <h1>
          <span></span>
          {TEXTS.solutionsSecondTittle.en}
        </h1>
        <h3>{TEXTS.solutionsThirdTittle.en}</h3>
      </div>
      <div className="solutions-content">
        <div>
          <SolutionsParagraph
            tittle={TEXTS.solutionsParagraphTittle1.en}
            text={TEXTS.solutionsParagraph1.en}
            icon={SecureIcon}
          ></SolutionsParagraph>
        </div>
        <div>
          <SolutionsParagraph
            tittle={TEXTS.solutionsParagraphTittle2.en}
            text={TEXTS.solutionsParagraph2.en}
            icon={GearIcon}
          ></SolutionsParagraph>
        </div>
        <div>
          <SolutionsParagraph
            tittle={TEXTS.solutionsParagraphTittle3.en}
            text={TEXTS.solutionsParagraph3.en}
            icon={FlowIcon}
          ></SolutionsParagraph>
        </div>
      </div>
    </>
  );
}
