import "./MainButton.css";

export default function MainButton({ text }) {
  return (
    <>
      <a href="#sobre-mi" className="btn">
        <span>{text}</span>
      </a>
    </>
  );
}
