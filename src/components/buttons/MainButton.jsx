import { Link } from "react-router-dom";
import "./MainButton.css";

export default function MainButton({ text, color, route }) {
  return (
    <Link
      to={route}
      className={
        color == "blue"
          ? "btn blue"
          : color == "grey"
          ? "btn grey"
          : "btn green"
      }
    >
      {text}
    </Link>
  );
}
