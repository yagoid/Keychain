import { TEXTS } from "../../assets/locales/texts.js";
import "./MainText.css";

export default function MainText() {
  return (
    <div className="main-text">
      <span className="main-text__line main-text__line--1">{TEXTS.trust.en}</span>
      <span className="main-text__line main-text__line--2">{TEXTS.decentralize.en}</span>
      <span className="main-text__line main-text__line--3">{TEXTS.enjoy.en}</span>
    </div>
  );
}
