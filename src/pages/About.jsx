import MainButton from "../components/MainButton";
import MainText from "../components/MainText";
import Navbar from "../components/Navbar";
import "./About.css";

export default function AboutPage() {
  return (
    <>
      <div className="about">
        <Navbar />
        {/* <a href="/home">Ir al home</a> */}
        <div className="main-content">
          <MainText />
          <MainButton text="Start" />
        </div>
      </div>
    </>
  );
}
