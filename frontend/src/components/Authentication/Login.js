import { useRef, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import LoginContext from '../../LoginContext/login-context';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import './Authentication.css';

const LoginForm = () => {
  const history = useHistory();
  const username = useRef();
  const password = useRef();

  const loginContext = useContext(LoginContext);

  const endpoint = '/user/signin';

  async function onSubmit(event) {
    event.preventDefault();

    const usernameValue = username.current.value;
    const passwordValue = password.current.value;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          email: usernameValue,
          password: passwordValue,
        }),
      });
      console.log(response);
      const data = await response.json();
      if (!response.ok) {
        alert('Something went wrong!');
      } else {
        loginContext.login(data.jwt);
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
            <button type="submit" className="btn big">
              Logg inn
            </button>
            <Link to="/signup">Registrer ny konto</Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
