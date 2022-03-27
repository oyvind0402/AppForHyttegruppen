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
  const [formCompleted, setFormCompleted] = useState(false);
  const [formData, setFormData] = useState({
    userID: '',
    accentureId: '',
    tripPurpose: '',
    period: [],
    numberOfCabins: 1,
    cabinAssigment: '',
    cabins: [
      {
        cabinName: 'Fanitullen',
      },
    ],
    winner: false,
  });

  useEffect(async () => {
    if (formCompleted) {
      console.log(formData);

      formData.period.forEach((period) => {
        let JsonBody = {
          userId: 0, //This needs to be replaced after testing !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
    }

    /*let JsonBody = {
        userId: 981279386,
        accentureId: 'my.id',
        tripPurpose: 'private',
        period: {
          id: 1,
          /*name: 'Week 1',
            season: { seasonName: 'winter2022' },
            start: '2022-02-02T00:00:00Z',
            end: '2022-02-09T00:00:00Z',
        },
        numberOfCabins: 1,
        cabinAssignment: 'random',
        cabins: [{ cabinName: 'Utsikten' }, { cabinName: 'Fanitullen' }],
        winner: false,
      };*/
  }, [formData]);

  const nextPage = (data) => {
    if (page === 1) {
      setFormData({
        ...formData,
        userId: data.userId,
        accentureId: data.accentureId,
        tripPurpose: data.tripPurpose,
      });
    }

    if (page === 2) {
      if (data.length != 0) {
        setFormData({
          ...formData,
          period: data,
        });
      }
    }

    if (page < 3) setPage(page + 1);
  };

  function previousPage(data) {
    if (page === 3) {
      setFormCompleted(false);
      setFormData({
        ...formData,
        numberOfCabins: data.numberOfCabins,
        cabinAssigment: data.cabinAssigment,
        //cabins: data.cabins,
      });
    }
    if (page != 1) setPage(page - 1);
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
      cabins: [
        {
          cabin_name: 'Fanitullen',
        },
      ],
      winner: false,
    });
  }

  const completeForm = (data) => {
    if (data.length != 0) {
      setFormCompleted(true);
      setFormData({
        ...formData,
        numberOfCabins: data.numberOfCabins,
        cabinAssigment: data.cabinAssigment,
        //cabins: data.cabins,
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
            nextPage={nextPage}
            nullstillForm={nullstillForm}
            formData={formData}
          />
        )}
        {page === 2 && (
          <Step2
            nextPage={nextPage}
            previousPage={previousPage}
            formData={formData}
          />
        )}
        {page === 3 && (
          <Step3
            completeForm={completeForm}
            previousPage={previousPage}
            formData={formData}
          />
        )}
      </div>
    </>
  );
};

export default Soknad;
