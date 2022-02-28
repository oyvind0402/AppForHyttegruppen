import { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import LoginContext from "../../../LoginContext/login-context";

const Header = () => {
  const history = useHistory();

  const loginContext = useContext(LoginContext);

  const loggedIn = loginContext.loggedIn;

  const logoutHandler = () => {
    loginContext.logout();
    history.replace("/");
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <button
        type="button"
        className="navbar-toggler"
        data-toggle="collapse"
        data-target="#navbarCollapse"
        aria-controls="navbarCollapse"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className="collapse navbar-collapse justify-content-between"
        id="navbarCollapse"
      >
        <div className="d-flex flex-row">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Hyttelotteriet
              </Link>
            </li>
            {loggedIn && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  Admin
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div className="d-flex flex-row justify-content-end">
          <ul className="navbar-nav mr-auto">
            {!loggedIn && (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            )}
            {loggedIn && (
              <li className="nav-item">
                <button className="btn btn-dark" onClick={logoutHandler}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
