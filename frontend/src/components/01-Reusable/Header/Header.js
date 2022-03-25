import { useContext, useState, useRef, useEffect } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import LoginContext from '../../../LoginContext/login-context';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { GiHamburgerMenu } from 'react-icons/gi';
import './Header.css';

const Header = () => {
  const history = useHistory();
  const loginContext = useContext(LoginContext);
  const [click, setClick] = useState(false);

  const loggedIn = loginContext.loggedIn;

  const [defaultLocale, setDefaultLocale] = useState(true);

  const logoutHandler = () => {
    loginContext.logout();
    history.replace('/');
  };

  const changeLanguage = () => {
    setDefaultLocale(!defaultLocale);
  };

  const handleClick = () => {
    setClick(!click);
  };

  return (
    <>
      <nav className="nav-container">
        <div className="left-side">
          <div className="home-icon">
            <Link to="/">
              <img
                src={`${process.env.PUBLIC_URL}/assets/pictures/Logo.svg`}
                alt="Hjemmeikon"
              />
            </Link>
          </div>
        </div>
        <div className={'nav-list'}>
          <p>
            <NavLink
              exact={true}
              activeClassName="active"
              className="nav-list-item"
              to="/"
            >
              Hjem
            </NavLink>
          </p>
          <p>
            <NavLink
              activeClassName="active"
              className="nav-list-item"
              to="/mineturer"
            >
              Mine Turer
            </NavLink>
          </p>
          <p>
            <NavLink
              activeClassName="active"
              className="nav-list-item"
              to="/soknad"
            >
              Søknad
            </NavLink>
          </p>
          <p>
            <NavLink
              activeClassName="active"
              className="nav-list-item"
              to="/hytter"
            >
              Hytter
            </NavLink>
          </p>
          <p>
            <NavLink
              activeClassName="active"
              className="nav-list-item"
              to="/hytteomraade"
            >
              Hemsedal
            </NavLink>
          </p>
          <p>
            <NavLink
              activeClassName="active"
              className="nav-list-item"
              to="/faq"
            >
              FAQ
            </NavLink>
          </p>
        </div>
        <div className="right-side">
          <a
            className="nav-list-logout"
            href="http://www.nooooooooooooooo.com/"
          >
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
        <div className="mobile-menu">
          <span className="menu-icon">
            {click ? (
              <IoIosCloseCircleOutline onClick={handleClick} />
            ) : (
              <GiHamburgerMenu onClick={handleClick} />
            )}
          </span>
        </div>
      </nav>
      {click && (
        <div className="nav-list-mobile">
          <NavLink
            exact={true}
            activeClassName="active"
            className="nav-list-mobile-item"
            to="/"
          >
            Hjem
          </NavLink>
          <NavLink
            activeClassName="active"
            className="nav-list-mobile-item"
            to="/mineturer"
          >
            Mine Turer
          </NavLink>
          <NavLink
            activeClassName="active"
            className="nav-list-mobile-item"
            to="/soknad"
          >
            Søknad
          </NavLink>
          <NavLink
            activeClassName="active"
            className="nav-list-mobile-item"
            to="/hytter"
          >
            Hytter
          </NavLink>
          <NavLink
            activeClassName="active"
            className="nav-list-mobile-item"
            to="/hytteomraade"
          >
            Hemsedal
          </NavLink>
          <NavLink
            activeClassName="active"
            className="nav-list-mobile-item"
            to="/faq"
          >
            FAQ
          </NavLink>
        </div>
      )}
      {click && <div className="blur-overlay" onClick={handleClick}></div>}
    </>
  );
};

export default Header;
