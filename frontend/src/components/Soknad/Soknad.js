import { useEffect, useState } from 'react';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import PopupApplication from '../01-Reusable/PopUp/PopupApplication';
import Progressbar from './Progressbar';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';
import './Soknad.css';

const Soknad = () => {
  const [page, setPage] = useState(1);
  const [popup, setPopup] = useState(false);
  const [popupResponse, setPopupResponse] = useState('');
  const [formCompleted, setFormCompleted] = useState(false);
  const [formData, setFormData] = useState({
    userId: localStorage.getItem('userID'),
    ansattnummerWBS: '',
    accentureId: '',
    tripPurpose: 'Privat',
    period: [],
    numberOfCabins: 0,
    cabinAssigment: 'random',
    cabins: [],
    kommentar: '',
    winner: false,
  });

  //Posting application per period
  useEffect(async () => {
    let postSuccessful = true;

    if (formCompleted) {
      formData.period.forEach((period) => {
        let JsonBody = {
          userId: localStorage.getItem('userID'),
          ansattnummerWBS: formData.ansattnummerWBS,
          accentureId: formData.accentureId,
          tripPurpose: formData.tripPurpose,
          period: period,
          numberOfCabins: formData.numberOfCabins,
          cabinAssignment: formData.cabinAssigment,
          cabins: formData.cabins,
          kommentar: formData.kommentar,
          winner: false,
        };

        fetch('/application/post', {
          method: 'POST',
          body: JSON.stringify(JsonBody),
          headers: { token: localStorage.getItem('refresh_token') },
        })
          .then((response) => console.log(response))
          .catch((error) => {
            postSuccessful = false;
            console.log(error);
          });
      });
      //post for email. Sends in user id
      if (postSuccessful) {
        const emailData = {};
        emailData['userId'] = formData.userId; //returns id
        emailData['periods'] = formData.period; //returns object
        console.log(formData.period);
        console.log(emailData);
        console.log(JSON.stringify(emailData));
        fetch('/email/post', {
          method: 'POST',
          body: JSON.stringify(emailData),
          // headers: {
          //   Accept: 'application/json',
          // },
        })
          .then((response) => console.log(response))
          .catch((error) => {
            console.log(error);
          });
      }

      //Everything is set back to the initial start position
      setFormCompleted(false);
      setPage(1);
      // nullstillForm();
    }
  }, [formData, formCompleted]);

  //Popuprepsone is being set
  //Force scroll up for the popup to show
  useEffect(() => {
    if (formCompleted) {
      setPopupResponse(formData.period);
      window.scrollTo(0, 0);
    }
  }, [formCompleted, formData.period]);

  //Popup will be showing here
  useEffect(() => {
    if (popupResponse !== '') setPopup(true);
  }, [popupResponse]);

  const updateForm = (data) => {
    if (page === 1) {
      setFormData({
        ...formData,
        ansattnummerWBS: data.ansattnummerWBS,
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
        kommentar: data.kommentar,
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
      userId: localStorage.getItem('userID'),
      ansattnummerWBS: '',
      accentureId: '',
      tripPurpose: 'Privat',
      period: [],
      numberOfCabins: 1,
      cabinAssigment: '',
      cabins: [],
      kommentar: '',
      winner: false,
    });
  }

  const completeForm = (data) => {
    if (data.length !== 0) {
      setFormCompleted(true);
      setFormData({
        ...formData,
        numberOfCabins: parseInt(data.numberOfCabins),
        cabinAssigment: data.cabinAssigment,
        cabins: data.cabins,
        kommentar: data.kommentar,
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
