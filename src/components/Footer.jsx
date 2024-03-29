import { TEXTS } from "./../assets/locales/texts.js";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer-content">
      <p>{TEXTS.footer.en}</p>
      <p>{TEXTS.privacyPolicy.en}</p>
    </footer>
  );
}
