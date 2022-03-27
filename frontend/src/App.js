import { Switch, Route, Redirect } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import { useContext } from 'react';
import LoginContext from './LoginContext/login-context';
import SignupPage from './pages/SignupPage';
import HytterPage from './pages/HytterPage';
import HyttePage from './pages/HyttePage';
import SoknadPage from './pages/SoknadPage';
import MinTurPage from './pages/MinTurPage';
import FAQPage from './pages/FAQPage';
import HytteomraadePage from './pages/HytteomraadePage';
import MineTurerPage from './pages/MineTurerPage';
import ScrollToTop from './ScrollToTop';

function App() {
  const loginContext = useContext(LoginContext);

  return (
    <Layout>
      <ScrollToTop />
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
        <Route path="/hytter">
          <HytterPage />
        </Route>
        <Route path="/hytte">
          <HyttePage />
        </Route>
        <Route path="/hytteomraade">
          <HytteomraadePage />
        </Route>
        <Route path="/soknad">
          <SoknadPage />
        </Route>
        <Route path="/mineturer">
          <MineTurerPage />
        </Route>
        <Route path="/mintur">
          <MinTurPage />
        </Route>
        <Route path="/faq">
          <FAQPage />
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
