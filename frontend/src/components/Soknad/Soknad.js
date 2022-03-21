import { useContext, useEffect, useState } from 'react';
import LoginContext from '../../LoginContext/login-context';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import Progressbar from './Progressbar';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';
import './Soknad.css';

const Soknad = () => {
  const loginContext = useContext(LoginContext);
  const loggedIn = loginContext.loggedIn;
  const [page, setPage] = useState(1);

  function nextPage() {
    if (page < 3) setPage(page + 1);
  }

  function previousPage() {
    if (page != 1) setPage(page - 1);
  }

  const clickOnProgressbar = (newPage) => {
    setPage(newPage);
  };

  function nullstillForm() {}

  function completeForm() {}

  return (
    <>
      <HeroBanner name="Søknad om hytte" />
      <Progressbar page={page} clickOnProgressbar={clickOnProgressbar} />
      <div className="content-soknad">
        <div className="step-soknad">
          {page === 1 && <Step1 />}
          {page === 2 && <Step2 />}
          {page === 3 && <Step3 />}
        </div>

        <div className="soknad-btn">
          {page === 1 ? (
            <button className="btn small btn-nonActive" onClick={nullstillForm}>
              Avbryt
            </button>
          ) : (
            <button className="btn small btn-nonActive" onClick={previousPage}>
              Forrige
            </button>
          )}

          {page === 3 ? (
            <button className="btn small" onClick={completeForm}>
              Fullfør
            </button>
          ) : (
            <button className="btn small" onClick={nextPage}>
              Neste
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Soknad;
