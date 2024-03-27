import { TEXTS } from "./../assets/locales/texts.js";
import "./FoundersContent.css";

export default function FoundersContent() {
  return (
    <div className="founders-content">
      <div className="founders-tittle">
        <h1>
          <span></span>
          {TEXTS.founders.en}
        </h1>
      </div>
      <div className="founders-text">
        <p>{TEXTS.foundersSection.en}</p>
      </div>
    </div>
  );
}
