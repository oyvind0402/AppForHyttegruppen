import { useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import LoginContext from "../../LoginContext/login-context";

const SignupForm = () => {
  const history = useHistory();
  const username = useRef();
  const password = useRef();

  const loginContext = useContext(LoginContext);

  const endpoint = "/api/signup";

  async function onSubmit(event) {
    event.preventDefault();

    const usernameValue = username.current.value;
    const passwordValue = password.current.value;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
          Username: usernameValue,
          Password: passwordValue,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        alert("Something went wrong!");
      } else {
        loginContext.login(data.jwt);
        history.replace("/");
      }
    } catch (error) {
      alert(error);
    }
  }

  return (
    <section>
      <h1 className="text-center">Sign up</h1>
      <div className="container w-50">
        <form onSubmit={onSubmit}>
          <div className="form-group pb-3">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="form-control"
              required
              ref={username}
            ></input>
          </div>
          <div className="form-group pb-3">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              required
              ref={password}
            ></input>
          </div>
          <div className="pt-3 d-flex justify-content-between">
            <button type="submit" className="btn btn-success">
              Create account
            </button>
            <Link to="/login">Login with existing account</Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignupForm;
