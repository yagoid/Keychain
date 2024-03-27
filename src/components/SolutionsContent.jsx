import { TEXTS } from "./../assets/locales/texts.js";
import "./SolutionsContent.css";

export default function SolutionsContent() {
  return (
    <>
      <div className="solutions-tittle">
        <h1>
          <span></span>
          {TEXTS.solutions.en}
        </h1>
      </div>
      <div className="solutions-content">
        <div>
          <p className="paragraph1">{TEXTS.solutionsParagraph1.en}</p>
        </div>
        <div>
          <p className="paragraph2">{TEXTS.solutionsParagraph2.en}</p>
        </div>
        <div>
          <p className="paragraph3">{TEXTS.solutionsParagraph3.en}</p>
        </div>
      </div>
    </>
  );
}
