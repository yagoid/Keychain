import hexagons1 from "./../assets/hexagons1.svg";
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
        <img
          src={hexagons1}
          className="hexagons1-background"
          alt="Background of hexagons"
        />
      </div>
    </>
  );
}
