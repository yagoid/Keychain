import logo from "./../assets/logo_keychain.svg";
import "./Navbar.css";

export default function () {
  return (
    <>
      <nav>
        <a href="javascript:location.reload()">
          <img src={logo} className="logo" alt="Logo de keychain" />
        </a>
        <div>
          <ul class="navbar">
            <li class="nav-item">
              <a href="#solutions">Solutions</a>
            </li>
            <li class="nav-item">
              <a href="#services">Services</a>
            </li>
            <li class="nav-item">
              <a href="#founders">Founders</a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
