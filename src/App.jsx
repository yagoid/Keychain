import { useState } from "react";
import AboutPage from "./pages/About";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import "./App.css";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  return (
    <main>
      {currentPath === "/" && <AboutPage />}
      {currentPath === "/login" && <LoginPage />}
    </main>
  );
}

export default App;
