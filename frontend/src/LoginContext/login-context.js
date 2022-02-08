import React, { useState } from "react";

//Setting default values to the context
const LoginContext = React.createContext({
  token: null,
  loggedIn: false,
  login: (token) => {},
  logout: () => {},
});

export const LoginContextProvider = (props) => {
  const key = "hyttetoken";

  const [token, setToken] = useState(localStorage.getItem(key));

  //Setting loggedIn as a boolean from a previous value
  const loggedIn = !!token;

  //Logging in sets the key with the token thats passed with the function
  const login = (token) => {
    setToken(token);
    localStorage.setItem(key, token);
  };

  //Logging out removes the key from local storage
  const logout = () => {
    setToken(null);
    localStorage.removeItem(key);
  };

  //Setting the values to the context
  const contextValues = {
    token: token,
    loggedIn: loggedIn,
    login: login,
    logout: logout,
  };

  return (
    <LoginContext.Provider value={contextValues}>
      {props.children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
