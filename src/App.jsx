import { useState } from "react";
import AboutPage from "./pages/About";
import ManagePage from "./pages/Manage";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import SignUpPage from "./pages/SignUp";
import "./App.css";
import PasswordGeneratorPage from "./pages/PasswordGenerator";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  return (
    <main>
      {currentPath === "/" && <AboutPage />}
      {currentPath === "/home" && <HomePage />}
      {currentPath === "/manage" && <ManagePage />}
      {currentPath === "/generator" && <PasswordGeneratorPage />}
      {currentPath === "/login" && <LoginPage />}
      {currentPath === "/signup" && <SignUpPage />}
    </main>
  );
}

export default App;
