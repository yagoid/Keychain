import { useState } from "react";
import AboutPage from "./pages/About";
import HomePage from "./pages/Home";
import "./App.css";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  return (
    <>
      {currentPath === "/" && <AboutPage />}
      {currentPath === "/home" && <HomePage />}
    </>
  );
}

export default App;
