import "./MainButton.css";

export default function MainButton({ text, color }) {
  return (
    <>
      <a
        href="#sobre-mi"
        className={color == "blue" ? "btn blue" : "btn green"}
      >
        <span>{text}</span>
      </a>
    </>
  );
}
