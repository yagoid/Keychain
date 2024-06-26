import AboutPage from "./pages/About";
import ManagePage from "./pages/Manage";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import SignUpPage from "./pages/SignUp";
import "./App.css";
import PasswordGeneratorPage from "./pages/PasswordGenerator";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import { KeyProvider } from "./contexts/keyContext/keyContext";

function App() {
  return (
    <AuthProvider>
      <KeyProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AboutPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/manage" element={<ManagePage />} />
            <Route path="/generator" element={<PasswordGeneratorPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
        </BrowserRouter>
      </KeyProvider>
    </AuthProvider>
  );
}

export default App;
