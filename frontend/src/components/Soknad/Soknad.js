import { useContext, useEffect, useState } from 'react';
import LoginContext from '../../LoginContext/login-context';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import PopupApplication from '../01-Reusable/PopUp/PopupApplication';
import Progressbar from './Progressbar';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';
import './Soknad.css';

const Soknad = () => {
  const loginContext = useContext(LoginContext);
  const loggedIn = loginContext.loggedIn;
  const [page, setPage] = useState(1);
  const [popup, setPopup] = useState(false);
  const [popupResponse, setPopupResponse] = useState('');
  const [formCompleted, setFormCompleted] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    accentureId: '',
    tripPurpose: '',
    period: [],
    numberOfCabins: 0,
    cabinAssigment: 'random',
    cabins: [],
    winner: false,
  });

  //Posting application per period
  useEffect(async () => {
    if (formCompleted) {
      formData.period.forEach((period) => {
        let JsonBody = {
          //userId: localStorage.getItem('userID'),
          userId: formData.userId,
          accentureId: formData.accentureId,
          tripPurpose: formData.tripPurpose,
          period: period,
          numberOfCabins: formData.numberOfCabins,
          cabinAssignment: formData.cabinAssigment,
          cabins: formData.cabins,
          winner: false,
        };

        fetch('/application/post', {
          method: 'POST',
          body: JSON.stringify(JsonBody),
        })
          .then((response) => console.log(response))
          .catch((error) => console.log(error));
      });
      //Everything is set back to the initial start position
      setFormCompleted(false);
      setPage(1);
      nullstillForm();
    }
  }, [formData]);

  //Popuprepsone is being set
  //Force scroll up for the popup to show
  useEffect(() => {
    if (formCompleted) {
      setPopupResponse(formData.period);
      window.scrollTo(0, 0);
    }
  }, [formCompleted]);

  //Popup will be showing here
  useEffect(() => {
    if (popupResponse !== '') setPopup(true);
  }, [popupResponse]);

  const updateForm = (data) => {
    if (page === 1) {
      setFormData({
        ...formData,
        userId: data.userId,
        accentureId: data.accentureId,
        tripPurpose: data.tripPurpose,
      });
    }

    if (page === 2) {
      if (data.length !== 0) {
        setFormData({
          ...formData,
          period: data,
        });
      }
    }

    if (page === 3) {
      setFormCompleted(false);
      setFormData({
        ...formData,
        numberOfCabins: parseInt(data.numberOfCabins),
        cabinAssigment: data.cabinAssigment,
        cabins: data.cabins,
      });
    }
  };

  const nextPage = () => {
    if (page < 3) setPage(page + 1);
  };

  function previousPage(data) {
    if (page !== 1) setPage(page - 1);
  }

  const clickOnProgressbar = (newPage) => {
    setPage(newPage);
  };

  function nullstillForm() {
    setFormData({
      userId: '',
      accentureId: '',
      tripPurpose: '',
      period: [],
      numberOfCabins: 1,
      cabinAssigment: '',
      cabins: [],
      winner: false,
    });
  }

  const completeForm = (data) => {
    console.log(data);
    if (data.length !== 0) {
      setFormCompleted(true);
      setFormData({
        ...formData,
        numberOfCabins: parseInt(data.numberOfCabins),
        cabinAssigment: data.cabinAssigment,
        cabins: data.cabins,
      });
    }
  };

  return (
    <>
      <HeroBanner name="Søknad om hytte" />
      <Progressbar page={page} clickOnProgressbar={clickOnProgressbar} />
      <div className="content-soknad">
        {page === 1 && (
          <Step1
            updateForm={updateForm}
            nextPage={nextPage}
            nullstillForm={nullstillForm}
            formData={formData}
          />
        )}
        {page === 2 && (
          <Step2
            updateForm={updateForm}
            nextPage={nextPage}
            previousPage={previousPage}
            formData={formData}
          />
        )}
        {page === 3 && (
          <Step3
            updateForm={updateForm}
            completeForm={completeForm}
            previousPage={previousPage}
            formData={formData}
          />
        )}
      </div>
      {popup === true && <PopupApplication periodArray={popupResponse} />}
    </>
  );
};

export default Soknad;
