import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import InfoPopup from '../01-Reusable/PopUp/InfoPopup';
import './Authentication.css';

const SignupForm = () => {
  const history = useHistory();
  const [registered, setRegistered] = useState(false);
  const [gotError, setGotError] = useState(false);
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState({});

  const [values, setValues] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleRegistered = () => {
    setRegistered(false);
    history.replace('/login');
  };

  const handleGotError = () => {
    setGotError(false);
  };

  async function onSubmit(event) {
    event.preventDefault();
    let errors = {};

    if (!values.email.trim()) {
      errors.email = 'Epost må fylles inn!';
    } else if (!/^([\w.-]+)@([\w-]+)((.(\w){2,3})+)$/i.test(values.email)) {
      errors.email = 'Feil format på epost!';
    }

    if (!values.password) {
      errors.password = 'Passord må fylles inn!';
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\\\-._()\\}{/,:;`^'¨=#"|<>])[A-Za-zøæåØÆÅ\d@$!%*?&\\\-._()\\}{/,:;`^'¨=#"<>|]{8,}$/i.test(
        values.password
      )
    ) {
      errors.password =
        'Passord må ha minst 8 tegn, en stor bokstav, en liten bokstav, ett tall og ett spesielt symbol!';
    }

    if (!values.firstname) {
      errors.firstname = 'Fornavn må fylles inn!';
    } else if (!/^[a-zA-ZøæåØÆÅ. \\-]{2,20}$/i.test(values.firstname)) {
      errors.firstname = 'Feil format på fornavn!';
    }

    if (!values.lastname) {
      errors.lastname = 'Etternavn må fylles inn!';
    } else if (!/^[a-zA-ZøæåØÆÅ. \\-]{2,30}$/i.test(values.lastname)) {
      errors.lastname = 'Feil format på etternavn!';
    }

    setErrors(errors);

    if (
      errors.email ||
      errors.password ||
      errors.firstname ||
      errors.lastname
    ) {
      return;
    }

    try {
      const response = await fetch('/api/user/post', {
        method: 'POST',
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          firstname: values.firstname,
          lastname: values.lastname,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setServerError(data.err);
        setGotError(true);
      } else {
        setRegistered(true);
      }
    } catch (error) {
      console.log(error);
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
              readOnly="readonly"
              onFocus={() => {
                if (
                  document
                    .getElementById('emailsignup')
                    .hasAttribute('readonly')
                ) {
                  document
                    .getElementById('emailsignup')
                    .removeAttribute('readonly');
                }
              }}
              id="emailsignup"
              type="text"
              className="form-control"
              placeholder="Epost..."
              name="email"
              value={values.email}
              onChange={(e) => handleChange(e)}
            />
            {errors.email && (
              <span className="login-error" id="email-login-error">
                {errors.email}
              </span>
            )}
          </div>
          <div className="login-form-group">
            <label htmlFor="password">Passord:</label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Passord..."
              value={values.password}
              onChange={handleChange}
            />
            {errors.password && (
              <span className="login-error" id="password-login-error">
                {errors.password}
              </span>
            )}
          </div>
          <div className="login-form-group">
            <label htmlFor="firstname">Fornavn:</label>
            <input
              name="firstname"
              type="text"
              className="form-control"
              placeholder="Fornavn..."
              value={values.firstname}
              onChange={handleChange}
            />
            {errors.firstname && (
              <span className="login-error" id="firstname-login-error">
                {errors.firstname}
              </span>
            )}
          </div>
          <div className="login-form-group">
            <label htmlFor="lastname">Etternavn:</label>
            <input
              name="lastname"
              type="text"
              className="form-control"
              placeholder="Etternavn..."
              value={values.lastname}
              onChange={handleChange}
            />
            {errors.lastname && (
              <span className="login-error" id="lastname-login-error">
                {errors.lastname}
              </span>
            )}
          </div>
          <div className="login-buttons">
            <button type="submit" className="btn big">
              Registrer
            </button>
            <Link className="register-focus" to="/login">
              Logg inn med eksisterende konto
            </Link>
          </div>
        </form>
        {registered && (
          <InfoPopup
            btnText="Ok"
            title="Bruker registrert"
            description={
              'Bruker med epost ' +
              values.email +
              " registrert! Trykk på 'Ok' for å gå til innloggingssiden."
            }
            hideMethod={handleRegistered}
          />
        )}
        {gotError && (
          <InfoPopup
            btnText="Ok"
            title="Bruker ikke registrert"
            description={
              'Det skjedde en feil under registreringen. Server svarte med: "' +
              serverError +
              '"' +
              ' Prøv igjen.'
            }
            hideMethod={handleGotError}
          />
        )}
      </div>
    </>
  );
};

export default SignupForm;
