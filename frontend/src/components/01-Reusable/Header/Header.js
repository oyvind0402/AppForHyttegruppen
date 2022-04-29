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
  const [visible, setVisible] = useState(true);
  const [soknadOpen, setSoknadOpen] = useState(false);

  const prevScrollPos = useRef(
    typeof window !== 'undefined' && window.pageYOffset
  );

  const loggedIn = loginContext.loggedIn;
  const adminAccess = loginContext.adminAccess;

  const logoutHandler = () => {
    if (click) {
      handleClick();
    }

    loginContext.logout();
    localStorage.removeItem('userID');
    history.replace('/');
  };

  const handleClick = () => {
    setClick(!click);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos =
        window.pageYOffset || document.documentElement.scrollTop;
      if (prevScrollPos.current > currentScrollPos) {
        setVisible(true);
      } else {
        setVisible(false);
      }
      prevScrollPos.current = currentScrollPos;
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/season/open');
      const data = await response.json();
      if (response.ok) {
        setSoknadOpen(data.isOpen);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <nav className={visible ? 'nav-container' : 'nav-hide'}>
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
            <button className="nav-list-logout" onClick={logoutHandler}>
              Logg ut
            </button>
          )}
          {!loggedIn && (
            <Link className="nav-list-logout" to="/login">
              Logg inn
            </Link>
          )}
          {adminAccess && (
            <NavLink className="nav-list-admin" to="/admin">
              Admin
            </NavLink>
          )}
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
            onClick={handleClick}
            to="/"
          >
            Hjem
          </NavLink>
          <NavLink
            activeClassName="active"
            className="nav-list-mobile-item"
            onClick={handleClick}
            to="/mineturer"
          >
            Mine Turer
          </NavLink>
          <NavLink
            activeClassName="active"
            className="nav-list-mobile-item"
            onClick={handleClick}
            to="/soknad"
          >
            Søknad
          </NavLink>
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
            <Link className="nav-list-mobile-item" onClick={logoutHandler}>
              Logg ut
            </Link>
          )}
          {!loggedIn && (
            <Link
              className="nav-list-mobile-item"
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
