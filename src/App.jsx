import { useState } from "react";
import AboutPage from "./pages/About";
import ManagePage from "./pages/Manage";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import SignUpPage from "./pages/SignUp";
import "./App.css";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  return (
    <main>
      {currentPath === "/" && <AboutPage />}
      {currentPath === "/home" && <HomePage />}
      {currentPath === "/manage" && <ManagePage />}
      {currentPath === "/login" && <LoginPage />}
      {currentPath === "/signup" && <SignUpPage />}
    </main>
  );
}

export default App;
