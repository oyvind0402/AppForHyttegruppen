import React, { useState } from 'react';
import Cookies from 'universal-cookie';

//Setting default values to the context
const LoginContext = React.createContext({
  token: null,
  loggedIn: false,
  adminAccess: false,
  login: (token, admin) => {},
  logout: () => {},
});

export const LoginContextProvider = (props) => {
  const key = 'tokenCreated';
  const adminKey = 'admin';

  const cookies = new Cookies();

  const [token, setToken] = useState(cookies.get(key));
  const [admin, setAdmin] = useState(cookies.get(adminKey));

  //Setting loggedIn and adminAccess as a boolean from a previous value
  const loggedIn = !!token;
  const adminAccess = !!token && !!admin;

  //Logging in sets the key with the token thats passed with the function
  const login = (admin) => {
    setToken(cookies.get(key));
    if (admin) {
      setAdmin(admin);
      cookies.set(adminKey, admin, { sameSite: 'strict', path: '/' });
    }
  };

  //Logging out removes the key from local storage
  const logout = () => {
    setToken(null);
    setAdmin(null);
    cookies.remove('admin', { path: '/' });
  };

  //Setting the values to the context
  const contextValues = {
    token: token,
    loggedIn: loggedIn,
    adminAccess: adminAccess,
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
