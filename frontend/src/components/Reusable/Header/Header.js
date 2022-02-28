import { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import LoginContext from "../../../LoginContext/login-context";
import "./Header.css";

const Header = () => {
  const history = useHistory();

  const loginContext = useContext(LoginContext);

  const loggedIn = loginContext.loggedIn;

  const logoutHandler = () => {
    loginContext.logout();
    history.replace("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          
        </div>
      </nav>
    </>
  );
};

export default Header;
