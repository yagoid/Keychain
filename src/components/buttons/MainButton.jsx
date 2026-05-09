import { Link } from "react-router-dom";
import "./MainButton.css";

export default function MainButton({ text, color, route, onClick, type }) {
  const variant =
    color === "blue"   ? "main-btn--plasma" :
    color === "grey"   ? "main-btn--ghost"  :
    color === "danger" ? "main-btn--danger" :
                         "main-btn--bone";

  const className = `main-btn ${variant}`;

  if (route) {
    return (
      <Link to={route} className={className} onClick={onClick}>
        <span className="main-btn__text">{text}</span>
        <span className="main-btn__arrow" aria-hidden="true">→</span>
      </Link>
    );
  }

  return (
    <button
      type={type || "button"}
      className={className}
      onClick={onClick}
    >
      <span className="main-btn__text">{text}</span>
      <span className="main-btn__arrow" aria-hidden="true">→</span>
    </button>
  );
}
