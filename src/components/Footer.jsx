import { Link } from "react-router-dom";
import { TEXTS } from "./../assets/locales/texts.js";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <span></span>
      <div className="footer-content">
        <p>{TEXTS.footer.en}</p>
        <p>
          <Link
            to="https://disco-holly-d3f.notion.site/Pol-tica-de-privacidad-d0029853470a410695e0f871652cf316?pvs=4"
            target="_blank"
          >
            {TEXTS.privacyPolicy.en}
          </Link>
        </p>
      </div>
    </footer>
  );
}
