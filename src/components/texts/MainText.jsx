import { TEXTS } from "../../assets/locales/texts.js";
import "./MainText.css";

export default function MainText() {
  return (
    <>
      <div className="texts">
        <span>{TEXTS.trust.en}</span>
        <span>{TEXTS.decentralize.en}</span>
        <span>{TEXTS.enjoy.en}</span>
      </div>
    </>
  );
}
