import { useRef } from 'react';
import { Link } from 'react-router-dom';
//import LoginContext from '../../LoginContext/login-context';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import './Authentication.css';

const SignupForm = () => {
  //const history = useHistory();
  const username = useRef();
  const password = useRef();
  const firstname = useRef();
  const lastname = useRef();

  //const loginContext = useContext(LoginContext);

  const endpoint = '/user/post';

  async function onSubmit(event) {
    event.preventDefault();

    const usernameValue = username.current.value;
    const passwordValue = password.current.value;
    const firstnameValue = firstname.current.value;
    const lastnameValue = lastname.current.value;

    try {
      let response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          email: usernameValue,
          password: passwordValue,
          firstname: firstnameValue,
          lastname: lastnameValue,
        }),
      });
      //const data = await response.json();
      if (!response.ok) {
        alert(response.statusText);
      } else {
        alert('Bruker registrert!');
      }
    } catch (error) {
      alert(error);
    }
  }

  return (
    <>
      <HeroBanner name="Registrer ny bruker" />
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
          <div className="login-form-group">
            <label htmlFor="firstname">Fornavn:</label>
            <input
              id="firstname"
              type="text"
              className="form-control"
              required
              placeholder="Fornavn..."
              ref={firstname}
            />
          </div>
          <div className="login-form-group">
            <label htmlFor="lastname">Etternavn:</label>
            <input
              id="lastname"
              type="text"
              className="form-control"
              required
              placeholder="Fornavn..."
              ref={lastname}
            />
          </div>
          <div className="login-buttons">
            <button type="submit" className="btn big">
              Registrer
            </button>
            <Link to="/login">Logg inn med eksisterende konto</Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignupForm;
