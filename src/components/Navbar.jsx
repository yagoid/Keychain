import logo from "./../assets/logo_keychain.svg";
import MainButton from "./MainButton";
import "./Navbar.css";

export default function () {
  return (
    <>
      <nav>
        <a href="javascript:location.reload()">
          <img src={logo} className="logo" alt="Logo de keychain" />
        </a>
        <div>
          <ul className="navbar">
            <li>
              <a className="active" href="#solutions">
                Solutions
              </a>
            </li>
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#founders">Founders</a>
            </li>
          </ul>
        </div>
        <MainButton text="Log In" />
      </nav>
    </>
  );
}
