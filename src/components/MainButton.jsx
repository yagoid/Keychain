import "./MainButton.css";

export default function MainButton({ text, color, route }) {
  return (
    <a
      href={route}
      className={
        color == "blue"
          ? "btn blue"
          : color == "grey"
          ? "btn grey"
          : "btn green"
      }
    >
      {text}
    </a>
  );
}
