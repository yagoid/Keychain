import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { doCreateUserWithEmailAndPassword } from "../services/firebase/auth";
import { isValidUsername, addNewUsername } from "../services/firebase/database";
import { useAuth } from "./../contexts/authContext";
import { TEXTS } from "./../assets/locales/texts.js";
import KeychainIcon from "./../assets/images/keychain.svg";
import hexagons2 from "./../assets/images/hexagons2.svg";
import "./Login.css";
import "./SignUp.css";

export default function SignUpPage() {
  const { userLoggedIn, currentUser } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isValidUsername, setIsValiUsername] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    // console.log("Username:", username);
    // console.log("Email:", email);
    // console.log("Password:", password);
    // console.log("Repeat Password:", repeatPassword);

    if (password != repeatPassword) {
      setErrorMessage(TEXTS.repeatPasswordError.en);
      console.log("Las contraseñas son distintas");
      return;
    }

    if (!isRegistering) {
      setIsRegistering(true);

      if (await isValidUsername(username)) {
        console.log("El username estça correcto");
        try {
          // Registrar al usuario
          await doCreateUserWithEmailAndPassword(email, password);
          try {
            // Guardar el username del usuario en firestore
            await addNewUsername(currentUser.uid, username);
            console.log(currentUser.id);
          } catch (error) {
            console.log("Error al guardar el username:", error);
            setIsRegistering(false);
          }
        } catch (error) {
          setErrorMessage(TEXTS.registerError.en);
          console.log("Error al registrar:", error);
          setIsRegistering(false);
        }
      } else {
        setErrorMessage(TEXTS.usernameNotValidError.en);
        console.log("El username ya existe");
        setIsRegistering(false);
      }
    }
  };

  // Función para manejar el cambio del username
  const handleUsernameChange = async (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);

    if (await isValidUsername(newUsername)) {
      setIsValiUsername(true);
      console.log(TEXTS.usernameValid.en);
    } else {
      setIsValiUsername(false);
      console.log(TEXTS.usernameNotValidError.en);
    }
  };

  return (
    <div>
      {userLoggedIn && <Navigate to={"../home"} replace={true} />}
      <Link to="/">
        <img className="login-logo" src={KeychainIcon} alt="Keychain logo" />
      </Link>
      <div className="signup-page">
        <div className="signup-container">
          <form className="login-form sign-form" onSubmit={handleLogin}>
            <div className="signup-heading">
              <h2>{TEXTS.createAccount.enUpperCase}</h2>
            </div>

            <h3 className="input-heading">{TEXTS.user.en}</h3>
            <div className="input-group">
              <input
                type="text"
                placeholder={TEXTS.user.en}
                value={username}
                onChange={handleUsernameChange}
                className="input-field"
                required
              />
            </div>

            <h3 className="input-heading">{TEXTS.email.en}</h3>
            <div className="input-group">
              <input
                type="email"
                placeholder={TEXTS.email.en}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <h3 className="input-heading">{TEXTS.password.en}</h3>
            <div className="input-group">
              <input
                type="password"
                placeholder={TEXTS.password.en}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <h3 className="input-heading">{TEXTS.repeatPassword.en}</h3>
            <div className="input-group">
              <input
                type="password"
                placeholder={TEXTS.repeatPassword.en}
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <button type="submit" className="login-btn">
              {TEXTS.signUp.en}
            </button>
            <div className="question-create-account">
              <p className="question">{TEXTS.questionAlreadyHaveAccount.en}</p>
              <Link to="/login" className="crete-account">
                {TEXTS.logIn.en}
              </Link>
            </div>
          </form>
        </div>
        <img
          src={hexagons2}
          className="hexagons2-background"
          alt="Background of hexagons"
        />
        <div className="welcome-text">
          <span>{TEXTS.welcome.en}</span>
          <span> {TEXTS.keychain.en}</span>
        </div>
      </div>
    </div>
  );
}
