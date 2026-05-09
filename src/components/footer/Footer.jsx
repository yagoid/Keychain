import { Link } from "react-router-dom";
import { TEXTS } from "../../assets/locales/texts.js";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="pb-footer">
      <div className="pb-footer__rule" aria-hidden="true">
        <span className="pb-footer__rule-line" />
        <span className="pb-footer__rule-hex" />
        <span className="pb-footer__rule-line" />
      </div>

      <div className="pb-footer__grid">
        <div className="pb-footer__col">
          <div className="pb-footer__brand">
            <span className="pb-footer__mark" aria-hidden="true" />
            <span className="pb-footer__word">KEYCHAIN</span>
          </div>
          <span className="pb-footer__legal">{TEXTS.footer.en}</span>
        </div>

        <div className="pb-footer__col pb-footer__col--mid">
          <span className="pb-footer__label">// CHAIN</span>
          <span className="pb-footer__data">private · proof-of-work</span>
        </div>

        <div className="pb-footer__col pb-footer__col--end">
          <span className="pb-footer__label">// VERSION</span>
          <span className="pb-footer__data">0x014.preview</span>
          <Link
            className="pb-footer__link"
            to="https://disco-holly-d3f.notion.site/Pol-tica-de-privacidad-d0029853470a410695e0f871652cf316?pvs=4"
            target="_blank"
            rel="noreferrer"
          >
            {TEXTS.privacyPolicy.en} ↗
          </Link>
        </div>
      </div>
    </footer>
  );
}
