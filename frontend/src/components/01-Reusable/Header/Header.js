import { useContext, useState, useRef, useEffect } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import LoginContext from '../../../LoginContext/login-context';
import './Header.css';

const Header = () => {
  const history = useHistory();

  const loginContext = useContext(LoginContext);

  const loggedIn = loginContext.loggedIn;

  const [defaultLocale, setDefaultLocale] = useState(true);

  const logoutHandler = () => {
    loginContext.logout();
    history.replace('/');
  };

  const changeLanguage = () => {
    setDefaultLocale(!defaultLocale);
  };

  return (
    <>
      <nav className="nav-container">
        <div className="left-side">
          <div className="home-icon">
            <Link to="/" className="link">
              <img
                src={`${process.env.PUBLIC_URL}/assets/pictures/Logo.svg`}
                alt="Hjemmeikon"
              />
            </Link>
          </div>
        </div>
        <div className="nav-list">
          <NavLink
            exact={true}
            activeClassName="active"
            className="nav-list-item"
            to="/"
          >
            Hjem
          </NavLink>
          <NavLink
            activeClassName="active"
            className="nav-list-item"
            to="/mineturer"
          >
            Mine Turer
          </NavLink>
          <NavLink
            activeClassName="active"
            className="nav-list-item"
            to="/soknad"
          >
            Søknad
          </NavLink>
          <NavLink
            activeClassName="active"
            className="nav-list-item"
            to="/hytter"
          >
            Hytter
          </NavLink>
          <NavLink
            activeClassName="active"
            className="nav-list-item"
            to="/hytteomraade"
          >
            Hemsedal
          </NavLink>
          <NavLink activeClassName="active" className="nav-list-item" to="/faq">
            FAQ
          </NavLink>
        </div>
        <div className="right-side">
          <a className="nav-list-item" href="http://www.nooooooooooooooo.com/">
            Logg ut
          </a>
          <img
            className="language-nor"
            onClick={changeLanguage}
            src={
              defaultLocale
                ? `${process.env.PUBLIC_URL}/assets/pictures/Norwegian.svg`
                : `${process.env.PUBLIC_URL}/assets/pictures/English.svg`
            }
            alt="Hjemmeikon"
          />
        </div>
      </nav>
    </>
  );
};

export default Header;
