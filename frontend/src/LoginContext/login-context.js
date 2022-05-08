import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';

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

  const cookies = new Cookies();

  const [token, setToken] = useState(cookies.get(key));
  const [refreshToken, setRefreshToken] = useState(cookies.get(key2));
  const [admin, setAdmin] = useState(cookies.get(adminKey));

  //Setting loggedIn and adminAccess as a boolean from a previous value
  const loggedIn = !!token && !!refreshToken;
  const adminAccess = !!token && !!admin && !!refreshToken;

  //Logging in sets the key with the token thats passed with the function
  const login = (token, refreshToken, admin) => {
    setToken(token);
    setRefreshToken(refreshToken);
    cookies.set(key, token, { sameSite: 'strict' });
    cookies.set(key2, refreshToken, { sameSite: 'strict' });
    if (admin) {
      setAdmin(admin);
      cookies.set(adminKey, admin, { sameSite: 'strict' });
    }
  };

  //Logging out removes the key from local storage
  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setAdmin(null);
    cookies.remove(key);
    cookies.remove(key2);
    cookies.remove(adminKey);
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
    if (cookies.get(key2)) {
      const jwtPayload = JSON.parse(window.atob(refreshToken.split('.')[1]));
      if (Date.now() >= jwtPayload.exp * 1000) {
        logout();
        window.location.href = '/login';
      }
    }
  });

  return (
    <LoginContext.Provider value={contextValues}>
      {props.children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
