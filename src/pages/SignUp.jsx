import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { auth } from "../services/firebase/firebase";
import { doCreateUserWithEmailAndPassword } from "../services/firebase/auth";
import { isValidUsername, addNewUsername } from "../services/firebase/database";
import { useAuth } from "./../contexts/authContext";
import { TEXTS } from "./../assets/locales/texts.js";
import KeychainIcon from "./../assets/images/keychain.svg";
import ErrorIcon from "./../assets/images/error_icon.svg";
import CorrectIcon from "./../assets/images/correct_icon.svg";
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
  const [isCorrectUsername, setIsCorrectUsername] = useState(false);
  const [isCorrectUsernameMessage, setIsCorrectUsernameMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    // console.log("Username:", username);
    // console.log("Email:", email);
    // console.log("Password:", password);
    // console.log("Repeat Password:", repeatPassword);

    if (password != repeatPassword) {
      setErrorMessage(TEXTS.repeatPasswordError.en);
      return;
    }

    if (!isRegistering) {
      setIsRegistering(true);

      if (await isValidUsername(username)) {
        // Registrar al usuario
        doCreateUserWithEmailAndPassword(email, password)
          .then(() => {
            // Guardar el username del usuario en firestore
            addNewUsername(auth.currentUser.uid, username)
              .then(() => {
                console.log("Username agregado");
              })
              .catch((error) => {
                // Manejar cualquier error de registro de username
                console.log("Error al guardar el username:", error);
                setIsRegistering(false);
              });
          })
          .catch((error) => {
            // Manejar cualquier error de registro
            setErrorMessage(TEXTS.registerError.en);
            setIsRegistering(false);
          });
      } else {
        setErrorMessage(TEXTS.usernameNotValidError.en);
        setIsRegistering(false);
      }
    }
  };

  // Función para manejar el cambio del username
  const handleUsernameChange = async (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);

    if (await isValidUsername(newUsername)) {
      setIsCorrectUsername(true);
      setIsCorrectUsernameMessage(TEXTS.usernameValid.en);
    } else {
      setIsCorrectUsername(false);
      setIsCorrectUsernameMessage(TEXTS.usernameNotValidError.en);
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
          <form className="login-form sign-form" onSubmit={handleRegister}>
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
              {isCorrectUsernameMessage != "" &&
                (isCorrectUsername ? (
                  <div className="correct-container">
                    <img
                      src={CorrectIcon}
                      className="correct-icon"
                      alt="Correct icon"
                    />
                    <span className="correct-message">
                      {TEXTS.usernameValid.en}
                    </span>
                  </div>
                ) : (
                  <div
                    className="error-container"
                    style={{ marginTop: "10px" }}
                  >
                    <img
                      src={ErrorIcon}
                      className="error-icon"
                      alt="Error icon"
                    />
                    <span className="error-message">
                      {TEXTS.usernameNotValidError.en}
                    </span>
                  </div>
                ))}
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
            {errorMessage != "" && (
              <div className="error-container">
                <img src={ErrorIcon} className="error-icon" alt="Error icon" />
                <span className="error-message">{errorMessage}</span>
              </div>
            )}
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
        <span className="privacy-policy-agree-text">
          {TEXTS.privacyPolicySignup.en}
          <span>
            <Link
              to="https://disco-holly-d3f.notion.site/Pol-tica-de-privacidad-d0029853470a410695e0f871652cf316?pvs=4"
              target="_blank"
              style={{ color: "#84af6d" }}
            >
              {TEXTS.privacyPolicy.en}
            </Link>
          </span>
        </span>
      </div>
    </div>
  );
}
