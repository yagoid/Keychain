import { TEXTS } from "../../assets/locales/texts.js";
import "./FoundersContent.css";

export default function FoundersContent() {
  return (
    <div className="fnd">
      <header className="fnd__head">
        <span className="pb-tag">// 03 — FOUNDERS</span>
        <h2 className="fnd__heading">
          {TEXTS.founders.en}
          <span className="fnd__heading-dot" aria-hidden="true" />
        </h2>
      </header>

      <div className="fnd__grid">
        <div className="fnd__id">
          <div className="fnd__avatar" aria-hidden="true">
            <span className="fnd__avatar-initials">YI</span>
            <span className="fnd__avatar-ring" />
            <span className="fnd__avatar-mark" />
          </div>
          <div className="fnd__id-meta">
            <span className="fnd__id-coord">// FOUNDER · 0x01</span>
            <span className="fnd__id-name">YAGO IGLESIAS</span>
            <span className="fnd__id-role">Computer Engineer · Author</span>
          </div>
          <ul className="fnd__id-stats">
            <li><span>STACK</span><span>React · Solidity · Crypto-JS</span></li>
            <li><span>FOCUS</span><span>Decentralized identity</span></li>
            <li><span>STATUS</span><span className="fnd__id-stats-alive">// LIVE</span></li>
          </ul>
        </div>

        <div className="fnd__bio">
          <p className="fnd__bio-text">{TEXTS.foundersSection.en}</p>
          <p className="fnd__bio-aside">
            // This project is a final-year thesis (TFG) — built with care,
            shipped in the open, and intentionally rough at the seams where
            roughness tells the truth.
          </p>
        </div>
      </div>
    </div>
  );
}
