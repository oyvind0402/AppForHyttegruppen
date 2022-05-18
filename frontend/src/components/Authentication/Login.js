import { useRef, useContext, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import LoginContext from '../../LoginContext/login-context';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import { BsExclamationTriangle } from 'react-icons/bs';

import './Authentication.css';

const LoginForm = () => {
  const history = useHistory();
  const username = useRef();
  const password = useRef();
  const [showFeedback, setShowFeedBack] = useState(false);

  const loginContext = useContext(LoginContext);

  async function onSubmit(event) {
    event.preventDefault();

    const usernameValue = username.current.value;
    const passwordValue = password.current.value;

    try {
      const response = await fetch('/api/user/signin', {
        method: 'POST',
        body: JSON.stringify({
          email: usernameValue,
          password: passwordValue,
        }),
      });
      const data = await response.json();
      setShowFeedBack(false);
      if (!response.ok) {
        setShowFeedBack(true);
      } else {
        loginContext.login(data.adminAccess);
        localStorage.setItem('userID', data.userId);
        history.replace('/');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <HeroBanner name="Logg inn" />
      <div className="login-container">
        <form onSubmit={onSubmit}>
          <div className="login-form-group">
            <label htmlFor="username">Epost:</label>
            <input
              id="username"
              type="text"
              className="form-control"
              required
              placeholder="Epost..."
              ref={username}
            />
          </div>
          <div className="login-form-group">
            <label htmlFor="password">Passord:</label>
            <input
              id="password"
              type="password"
              className="form-control"
              required
              placeholder="Passord..."
              ref={password}
            />
          </div>
          <div className="login-buttons">
            {showFeedback && (
              <p className="login-error">
                <BsExclamationTriangle /> Epost eller passord er feil!
              </p>
            )}
            <button type="submit" className="btn big">
              Logg inn
            </button>
            <Link className="register-focus" to="/signup">
              Registrer ny konto
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
