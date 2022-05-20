import { useContext, useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import LoginContext from '../../../LoginContext/login-context';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { GiHamburgerMenu } from 'react-icons/gi';
import './Header.css';

const Header = () => {
  const loginContext = useContext(LoginContext);
  const [click, setClick] = useState(false);
  const [soknadOpen, setSoknadOpen] = useState(false);

  const loggedIn = loginContext.loggedIn;
  const adminAccess = loginContext.adminAccess;

  const logoutHandler = () => {
    if (click) {
      handleClick();
    }
    fetch('/api/user/logout')
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
    loginContext.logout();
    localStorage.removeItem('userID');
  };

  const handleClick = () => {
    setClick(!click);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/season/open');
        const data = await response.json();
        if (response.ok) {
          setSoknadOpen(data.isOpen);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <nav className="nav-container">
        <div className="left-side">
          <div className="home-icon">
            <a className="secret-tab-button" href="#container">
              Skip to content
            </a>
            <Link to="/" className="header-focus">
              <img
                src={`${process.env.PUBLIC_URL}/assets/pictures/Logo.svg`}
                alt="Hjemmeikon"
              />
            </Link>
          </div>
        </div>
        <div className={loggedIn ? 'nav-list' : 'nav-list-smaller'}>
          <p className="nav-text">
            <NavLink
              exact={true}
              activeClassName="active"
              className="nav-list-item"
              to="/"
            >
              Hjem
            </NavLink>
          </p>
          {loggedIn && (
            <p className="nav-text">
              <NavLink
                activeClassName="active"
                className="nav-list-item"
                to="/mineturer"
              >
                Mine Turer
              </NavLink>
            </p>
          )}
          {loggedIn && (
            <p className="nav-text">
              <NavLink
                activeClassName="active"
                className="nav-list-item"
                to={soknadOpen ? '/soknad' : '/stengt'}
              >
                Søknad
              </NavLink>
            </p>
          )}
          <p className="nav-text">
            <NavLink
              activeClassName="active"
              className="nav-list-item"
              to="/hytter"
            >
              Hytter
            </NavLink>
          </p>
          <p className="nav-text">
            <NavLink
              activeClassName="active"
              className="nav-list-item"
              to="/hytteomraade"
            >
              Hemsedal
            </NavLink>
          </p>
          <p className="nav-text">
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
          {loggedIn && (
            <Link
              className="nav-list-item nav-list-logout"
              to="/"
              onClick={logoutHandler}
            >
              Logg ut
            </Link>
          )}
          {!loggedIn && (
            <Link className="nav-list-item nav-list-logout" to="/login">
              Logg inn
            </Link>
          )}
          {adminAccess && (
            <NavLink className="nav-list-item nav-list-admin" to="/admin">
              Admin
            </NavLink>
          )}
        </div>
        <div className="mobile-menu">
          <span className="menu-icon">
            {click ? (
              <IoIosCloseCircleOutline
                aria-label="close menu"
                onClick={handleClick}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleClick();
                }}
              />
            ) : (
              <GiHamburgerMenu
                aria-label="Open menu"
                onClick={handleClick}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleClick();
                }}
              />
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
            onClick={handleClick}
            to="/"
          >
            Hjem
          </NavLink>
          {loggedIn && (
            <NavLink
              activeClassName="active"
              className="nav-list-mobile-item"
              onClick={handleClick}
              to="/mineturer"
            >
              Mine Turer
            </NavLink>
          )}
          {loggedIn && (
            <NavLink
              activeClassName="active"
              className="nav-list-mobile-item"
              onClick={handleClick}
              to="/soknad"
            >
              Søknad
            </NavLink>
          )}
          <NavLink
            activeClassName="active"
            className="nav-list-mobile-item"
            onClick={handleClick}
            to="/hytter"
          >
            Hytter
          </NavLink>
          <NavLink
            activeClassName="active"
            className="nav-list-mobile-item"
            onClick={handleClick}
            to="/hytteomraade"
          >
            Hemsedal
          </NavLink>
          <NavLink
            activeClassName="active"
            className="nav-list-mobile-item"
            onClick={handleClick}
            to="/faq"
          >
            FAQ
          </NavLink>
          {adminAccess && (
            <NavLink
              activeClassName="active"
              className="nav-list-mobile-item"
              onClick={handleClick}
              to="/admin"
            >
              Admin
            </NavLink>
          )}
          {loggedIn && (
            <Link
              className="nav-list-mobile-item logout-mobile"
              onClick={logoutHandler}
              to="/"
            >
              Logg ut
            </Link>
          )}
          {!loggedIn && (
            <Link
              className="nav-list-mobile-item logout-mobile"
              to="/login"
              onClick={handleClick}
            >
              Logg inn
            </Link>
          )}
        </div>
      )}
      {click && <div className="blur-overlay" onClick={handleClick}></div>}
    </>
  );
};

export default Header;
