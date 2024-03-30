import "./MainButton.css";

export default function MainButton({ text, color, route }) {
  return (
    <>
      <a href={route} className={color == "blue" ? "btn blue" : "btn green"}>
        <span>{text}</span>
      </a>
    </>
  );
}
