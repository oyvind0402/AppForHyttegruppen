import { useContext, useState } from 'react';
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
  const [formData, setFormData] = useState({
    UserID: '',
    AccentureId: '',
    TripPurpose: '',
    Period: [],
    NumberOfCabins: 0,
    Cabins: [],
    CabinsWons: '',
    Winner: false,
  });

  const nextPage = (data) => {
    if (page === 1) {
      setFormData({
        ...formData,
        UserID: data.UserId,
        AccentureId: data.AccentureId,
        TripPurpose: data.TripPurpose,
      });
    }

    if (page === 2) {
      setFormData({
        ...formData,
        Period: data.Period,
      });
    }

    if (page < 3) setPage(page + 1);
    console.log(formData);
  };

  function previousPage() {
    if (page != 1) setPage(page - 1);
    console.log(formData);
  }

  const clickOnProgressbar = (newPage) => {
    setPage(newPage);
  };

  function nullstillForm() {
    setFormData({
      UserID: '',
      AccentureId: '',
      TripPurpose: '',
      Period: [],
      NumberOfCabins: 0,
      Cabins: [],
      CabinsWons: '',
      Winner: false,
    });
  }

  function completeForm() {}

  return (
    <>
      <HeroBanner name="Søknad om hytte" />
      <Progressbar page={page} clickOnProgressbar={clickOnProgressbar} />
      <div className="content-soknad">
        {page === 1 && (
          <Step1
            nextPage={nextPage}
            nullstillForm={nullstillForm}
            formData={formData}
          />
        )}
        {page === 2 && (
          <Step2 nextPage={nextPage} previousPage={previousPage} />
        )}
        {page === 3 && (
          <Step3 completeForm={completeForm} previousPage={previousPage} />
        )}
      </div>
    </>
  );
};

export default Soknad;
