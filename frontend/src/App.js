import { Switch, Route, Redirect } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import { useContext } from 'react';
import LoginContext from './LoginContext/login-context';
import SignupPage from './pages/SignupPage';

function App() {
  const loginContext = useContext(LoginContext);

  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
          {!loginContext.loggedIn && (
            <Route path="/login">
              <LoginPage />
            </Route>
          )}
        {!loginContext.loggedIn && (
          <Route path="/signup">
            <SignupPage />
          </Route>
        )}
        <Route path="/admin">
          {loginContext.loggedIn && <AdminPage />}
          {!loginContext.loggedIn && <Redirect to="/login" />}
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
