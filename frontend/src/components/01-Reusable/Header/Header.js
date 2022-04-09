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

  const prevScrollPos = useRef(
    typeof window !== 'undefined' && window.pageYOffset
  );

  const loggedIn = loginContext.loggedIn;
  const adminAccess = loginContext.adminAccess;

  //const [defaultLocale, setDefaultLocale] = useState(true);

  const logoutHandler = () => {
    if (click) {
      handleClick();
    }

    loginContext.logout();
    localStorage.removeItem('userID');
    history.replace('/');
  };

  /*const changeLanguage = () => {
    setDefaultLocale(!defaultLocale);
  };*/

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
          {loggedIn && (
            <a className="nav-list-logout" onClick={logoutHandler}>
              Logg ut
            </a>
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
          {/*<img
            className="language-nor"
            onClick={changeLanguage}
            src={
              defaultLocale
                ? `${process.env.PUBLIC_URL}/assets/pictures/Norwegian.svg`
                : `${process.env.PUBLIC_URL}/assets/pictures/English.svg`
            }
            alt="Hjemmeikon"
          />*/}
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
