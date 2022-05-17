import { Switch, Route, Redirect } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import { useContext, useEffect, useState } from 'react';
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
import OpenPeriod from './components/Admin/OpenPeriod';
import AddCabin from './components/Admin/Cabins/AddCabin';
import UploadCabinPics from './components/Admin/UploadPics/UploadCabinPics';
import UploadCabinPic from './components/Admin/UploadPics/UploadCabinPic';
import EditApplicationPeriods from './components/Admin/ApplicationPeriods/EditApplicationPeriods';
import AddFAQ from './components/Admin/FAQ/AddFAQ';
import EditFAQs from './components/Admin/FAQ/EditFAQs';
import EditFAQ from './components/Admin/FAQ/EditFAQ';
import SoknadStengtPage from './pages/SoknadStengtPage';
import EditPeriod from './components/Admin/ApplicationPeriods/EditPeriod';
import UploadOrDeleteCabinsPics from './components/Admin/UploadPics/UploadOrDeleteCabinsPics';
import DeleteCabinPic from './components/Admin/UploadPics/DeleteCabinPic';
import DeleteCabinsPic from './components/Admin/UploadPics/DeleteCabinsPic';
import AdminSettings from './components/Admin/AdminSettings/AdminSettings';
import EditSeasons from './components/Admin/ApplicationPeriods/EditSeasons';
import EditSeason from './components/Admin/ApplicationPeriods/EditSeason';
import AddPeriod from './components/Admin/ApplicationPeriods/AddPeriod';

function App() {
  const loginContext = useContext(LoginContext);

  const [soknadOpen, setSoknadOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/season/open');
        const data = await response.json();
        if (response.ok) {
          setSoknadOpen(data.isOpen);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

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
        <Route path="/admin/redigerbilder">
          {loginContext.adminAccess && <UploadOrDeleteCabinsPics />}
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
        <Route path="/admin/slettbilder">
          {loginContext.adminAccess && <DeleteCabinsPic />}
          {!loginContext.adminAccess && <Redirect to="/login" />}
        </Route>
        <Route path="/admin/slettbilde">
          {loginContext.adminAccess && <DeleteCabinPic />}
          {!loginContext.adminAccess && <Redirect to="/login" />}
        </Route>
        <Route path="/admin/startsoknad">
          {loginContext.adminAccess && <OpenPeriod />}
          {!loginContext.adminAccess && <Redirect to="/login" />}
        </Route>
        <Route path="/admin/endreperioder">
          {loginContext.adminAccess && <EditApplicationPeriods />}
          {!loginContext.adminAccess && <Redirect to="/login" />}
        </Route>
        <Route path="/admin/endreperiode">
          {loginContext.adminAccess && <EditPeriod />}
          {!loginContext.adminAccess && <Redirect to="/login" />}
        </Route>
        <Route path="/admin/leggtilperiode">
          {loginContext.adminAccess && <AddPeriod />}
          {!loginContext.adminAccess && <Redirect to="/login" />}
        </Route>
        <Route path="/admin/endresesonger">
          {loginContext.adminAccess && <EditSeasons />}
          {!loginContext.adminAccess && <Redirect to="/login" />}
        </Route>
        <Route path="/admin/endresesong">
          {loginContext.adminAccess && <EditSeason />}
          {!loginContext.adminAccess && <Redirect to="/login" />}
        </Route>
        <Route path="/admin/endresoknader">
          {loginContext.adminAccess && <Applications />}
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
        <Route path="/admin/innstillinger">
          {loginContext.adminAccess && <AdminSettings />}
          {!loginContext.adminAccess && <Redirect to="/login" />}
        </Route>

        {!soknadOpen && (
          <Route path="/stengt">
            <SoknadStengtPage />
          </Route>
        )}

        <Route path="/hytter">
          <HytterPage />
        </Route>
        <Route path="/hytte/*">
          <HyttePage />
        </Route>
        <Route path="/hytteomraade">
          <HytteomraadePage />
        </Route>
        {soknadOpen && (
          <Route path="/soknad">
            <SoknadPage />
          </Route>
        )}
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
