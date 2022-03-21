import { useContext, useEffect, useState } from 'react';
import LoginContext from '../../LoginContext/login-context';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import Progressbar from './Progressbar';
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
        <p>{page}</p>

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
