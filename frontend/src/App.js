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
import EditCabin from './components/Admin/Cabins/EditCabin';
import EditSite from './components/Admin/EditSite';
import EditCabins from './components/Admin/Cabins/EditCabins';
import Applications from './components/Admin/Applications/EditSoknader';
import Application from './components/Admin/Applications/EditSoknad';
import OpenPeriod from './components/Admin/OpenPeriod';
import AddCabin from './components/Admin/Cabins/AddCabin';
import UploadCabinPics from './components/Admin/UploadPics/UploadCabinPics';
import UploadCabinPic from './components/Admin/UploadPics/UploadCabinPic';
import EditPeriods from './components/Admin/Periods/EditPeriods';
import AddFAQ from './components/Admin/FAQ/AddFAQ';
import EditFAQs from './components/Admin/FAQ/EditFAQs';
import EditFAQ from './components/Admin/FAQ/EditFAQ';

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
        <Route path="/admin" exact>
          {loginContext.adminAccess && <AdminPage />}
          {!loginContext.adminAccess && <Redirect to="/login" />}
        </Route>
        <Route path="/admin/lastoppbilder">
          {loginContext.adminAccess && <UploadCabinPics />}
          {!loginContext.adminAccess && <Redirect to="/login" />}
        </Route>
        <Route path="/admin/lastoppbilde">
          {loginContext.adminAccess && <UploadCabinPic />}
          {!loginContext.adminAccess && <Redirect to="/login" />}
        </Route>
        <Route path="/admin/startsoknad">
          {loginContext.adminAccess && <OpenPeriod />}
          {!loginContext.adminAccess && <Redirect to="/login" />}
        </Route>
        <Route path="/admin/endreperioder">
          {loginContext.adminAccess && <EditPeriods />}
          {!loginContext.adminAccess && <Redirect to="/login" />}
        </Route>
        <Route path="/admin/endresoknader">
          {loginContext.adminAccess && <Applications />}
          {!loginContext.adminAccess && <Redirect to="/login" />}
        </Route>
        <Route path="/admin/endresoknad">
          {loginContext.adminAccess && <Application />}
          {!loginContext.adminAccess && <Redirect to="/login" />}
        </Route>
        <Route path="/admin/endringer">
          {loginContext.adminAccess && <EditSite />}
          {!loginContext.adminAccess && <Redirect to="/login" />}
        </Route>
        <Route path="/admin/endrehytter">
          {loginContext.adminAccess && <EditCabins />}
          {!loginContext.adminAccess && <Redirect to="/login" />}
        </Route>
        <Route path="/admin/endrehytte">
          {loginContext.adminAccess && <EditCabin />}
          {!loginContext.adminAccess && <Redirect to="/login" />}
        </Route>
        <Route path="/admin/leggtilhytte">
          {loginContext.adminAccess && <AddCabin />}
          {!loginContext.adminAccess && <Redirect to="/login" />}
        </Route>
        <Route path="/admin/endrefaqs">
          {loginContext.adminAccess && <EditFAQs />}
          {!loginContext.adminAccess && <Redirect to="/login" />}
        </Route>
        <Route path="/admin/endrefaq">
          {loginContext.adminAccess && <EditFAQ />}
          {!loginContext.adminAccess && <Redirect to="/login" />}
        </Route>
        <Route path="/admin/leggtilfaq">
          {loginContext.adminAccess && <AddFAQ />}
          {!loginContext.adminAccess && <Redirect to="/login" />}
        </Route>

        <Route path="/hytter">
          <HytterPage />
        </Route>
        <Route path="/hytte/*">
          <HyttePage />
        </Route>
        <Route path="/hytteomraade">
          <HytteomraadePage />
        </Route>
        <Route path="/soknad">
          <SoknadPage />
        </Route>
        <Route path="/mineturer">
          {loginContext.loggedIn && <MineTurerPage />}
          {!loginContext.loggedIn && <Redirect to="/login" />}
        </Route>
        <Route path="/mintur">
          {loginContext.loggedIn && <MinTurPage />}
          {!loginContext.loggedIn && <Redirect to="/login" />}
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
