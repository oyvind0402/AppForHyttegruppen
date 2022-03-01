import { useContext, useState, useRef, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import LoginContext from "../../../LoginContext/login-context";
import "./Header.css";
import icon from "../../../static/greaterthanicon.png";
import userpic from "../../../static/default-pic.jpg";
import ProfilePopup from "./ProfilePopup";

const Header = () => {
  const history = useHistory();

  const loginContext = useContext(LoginContext);

  const loggedIn = loginContext.loggedIn;

  const logoutHandler = () => {
    handlePfpClick();
    loginContext.logout();
    history.replace("/");
  };
  
  
  const [visible, setVisible] = useState(false);
  
  const handlePfpClick = () => {
    if (visible) {
      setVisible(!visible);
      document.getElementById("profile-popup").style.display = "none";

    } else {
      setVisible(!visible);
      document.getElementById('profile-popup').style.display = "block";
    }
  }

  return (
    <>
      <nav className="nav-container">
        <div className="left-side">
          <div className="home-icon">
            <Link to="/" className="link">
              <img src={icon} alt="Hjemmeikon" />
            </Link>
          </div>
          <div className="nav-title">
            <Link className="link" to="/">
              HyttePortal
            </Link>
          </div>
        </div>
        <div className="nav-list">
          <Link className="nav-list-item" to="/hytter">
            Hytter
          </Link>
          <Link className="nav-list-item" to="/soknad">
            Søknad
          </Link>
          <Link className="nav-list-item" to="/hytteomraade">
            Hemsedal
          </Link>
          <Link className="nav-list-item" to="/faq">
            FAQ
          </Link>
        </div>
        <div onClick={handlePfpClick} className="user-icon">
          <img src={userpic} alt="Profilbilde" />
        </div>
        <ProfilePopup>
          {}<div className="profile-popup-title">
            <h3>Navn Navnesen</h3>
            <p>navn.navnesen@accenture.com</p>
          </div>
          <hr />
          <div className="profile-popup-buttons">
            <Link
              onClick={handlePfpClick}
              className="minside-btn link-white"
              to="/minside"
            >
              Min Side
            </Link>
            <Link className="logout-btn">
              Logg ut
              {/*loggedIn ? 'Logg ut' : 'Logg inn'*/}
            </Link>
          </div>
        </ProfilePopup>
      </nav>
    </>
  );
};

export default Header;
