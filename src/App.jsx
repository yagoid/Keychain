import { useState } from "react";
import AboutPage from "./pages/About";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import "./App.css";
import SignUpPage from "./pages/SignUp";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  return (
    <main>
      {currentPath === "/" && <AboutPage />}
      {currentPath === "/home" && <HomePage />}
      {currentPath === "/login" && <LoginPage />}
      {currentPath === "/signup" && <SignUpPage />}
    </main>
  );
}

export default App;
