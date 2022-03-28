import React, { useState } from 'react';

//Setting default values to the context
const LoginContext = React.createContext({
  token: null,
  loggedIn: false,
  adminAccess: false,
  login: (token, admin) => {},
  logout: () => {},
});

export const LoginContextProvider = (props) => {
  const key = 'hyttetoken';
  const adminKey = 'admin';
  //comment check

  const [token, setToken] = useState(localStorage.getItem(key));
  const [admin, setAdmin] = useState(localStorage.getItem(adminKey));

  //Setting loggedIn and adminAccess as a boolean from a previous value
  const loggedIn = !!token;
  const adminAccess = !!admin;

  //Logging in sets the key with the token thats passed with the function
  const login = (token, admin) => {
    setToken(token);
    localStorage.setItem(key, token);
    if (admin) {
      setAdmin(admin);
      localStorage.setItem(adminKey, admin);
    }
  };

  //Logging out removes the key from local storage
  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem(key);
    localStorage.removeItem(adminKey);
  };

  //Setting the values to the context
  const contextValues = {
    token: token,
    loggedIn: loggedIn,
    adminAccess: admin,
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
