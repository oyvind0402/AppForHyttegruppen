import React, { useEffect, useState } from 'react';

//Setting default values to the context
const LoginContext = React.createContext({
  token: null,
  refreshToken: null,
  loggedIn: false,
  adminAccess: false,
  login: (token, refreshToken, admin) => {},
  logout: () => {},
});

export const LoginContextProvider = (props) => {
  const key = 'token';
  const key2 = 'refresh_token';
  const adminKey = 'admin';
  //comment check

  const [token, setToken] = useState(localStorage.getItem(key));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem(key2));
  const [admin, setAdmin] = useState(localStorage.getItem(adminKey));

  //Setting loggedIn and adminAccess as a boolean from a previous value
  const loggedIn = !!token && !!refreshToken;
  const adminAccess = !!admin;

  //Logging in sets the key with the token thats passed with the function
  const login = (token, refreshToken, admin) => {
    setToken(token);
    setRefreshToken(refreshToken);
    localStorage.setItem(key, token);
    localStorage.setItem(key2, refreshToken);
    if (admin) {
      setAdmin(admin);
      localStorage.setItem(adminKey, admin);
    }
  };

  //Logging out removes the key from local storage
  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setAdmin(null);
    localStorage.removeItem(key);
    localStorage.removeItem(key2);
    localStorage.removeItem(adminKey);
  };

  //Setting the values to the context
  const contextValues = {
    token: token,
    refreshToken: refreshToken,
    loggedIn: loggedIn,
    adminAccess: adminAccess,
    login: login,
    logout: logout,
  };

  useEffect(() => {
    if (localStorage.getItem('refresh_token')) {
      const jwtPayload = JSON.parse(window.atob(refreshToken.split('.')[1]));
      if (Date.now() >= jwtPayload.exp * 1000) {
        logout();
      }
    }
  }, []);

  return (
    <LoginContext.Provider value={contextValues}>
      {props.children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
