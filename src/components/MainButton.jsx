import "./MainButton.css";

export default function MainButton({ text }) {
  return (
    <>
      <a href="#sobre-mi" class="btn">
        <span>{text}</span>
      </a>
    </>
  );
}
