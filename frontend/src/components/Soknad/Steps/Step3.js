import { useEffect, useState } from 'react';
import { BsQuestionCircle, BsExclamationTriangle } from 'react-icons/bs';
import CabinCardSmall from './../../01-Reusable/CabinCard/CabinCardSmall';
import './Steps.css';
import './Step3.css';

const Step3 = (props) => {
  const [numberOfCabins, setNumberOfCabins] = useState(
    props.formData.numberOfCabins
  );
  const [cabinAssigment, setCabinAssigment] = useState(
    props.formData.cabinAssigment
  );
  const [showFeedBackNumber, setShowFeedBackNumber] = useState(false);

  const [cabins, setCabins] = useState([]);
  let pickedCabins = [];
  //Fetching
  useEffect(() => {
    async function fetchData() {
      fetch('/cabin/all')
        .then((response) => response.json())
        .then((data) => setCabins(data))
        .catch((error) => console.log(error));
    }
    fetchData();
  }, []);

  //No cabin is picked yet
  useEffect(() => {
    cabins.map((cabin) => {
      pickedCabins.push(false);
      return '';
    });
  }, [cabins]);

  function setPickedCabin(picked, index) {
    pickedCabins[index] = picked;
  }

  //Getting current input data
  const getCurrentData = () => {
    let valgteCabins = [];

    if (cabinAssigment === 'random') {
      valgteCabins = cabins.map((cabin) => {
        return { cabinName: cabin.name };
      });
    } else {
      let filteredCabins = cabins.filter((cabin, index) => {
        if (pickedCabins[index]) {
          return { cabinName: cabin.name };
        }
        return '';
      });
      valgteCabins = filteredCabins.map((cabin) => {
        return { cabinName: cabin.name };
      });
    }

    const step3Data = {
      numberOfCabins: numberOfCabins,
      cabinAssigment: cabinAssigment,
      cabins: valgteCabins,
    };
    return step3Data;
  };

  const previousPage = () => {
    const step3Data = getCurrentData();
    props.updateForm(step3Data);
    props.previousPage();
  };

  const sendInApplication = () => {
    if (numberOfCabins === 0) {
      setShowFeedBackNumber(true);
      return;
    }
    const step3Data = getCurrentData();
    props.completeForm(step3Data);
  };

  return (
    <>
      <div className="step-soknad">
        <div className="stepQuestion">
          <BsQuestionCircle className="soknad-question-icon" />
          <p className="soknad-question-text">Velg hytter</p>
        </div>
        <div className="soknad-step3-antall">
          <label className="soknad-label" htmlFor="numberOfHytter">
            Ønsket antall hytter
          </label>

          <input
            className="soknad-input"
            type="number"
            id="numberOfHytter"
            value={numberOfCabins}
            name="numberOfHytter"
            min="0"
            max="4"
            onChange={(event) => {
              setNumberOfCabins(event.target.value);
              setShowFeedBackNumber(false);
            }}
          />
          {showFeedBackNumber && (
            <p className="soknad-error step3-error">
              <BsExclamationTriangle /> Husk å legge til antall hytter!
            </p>
          )}
        </div>

        {numberOfCabins > 0 && (
          <div className="soknad-step3-antall step3-radio">
            <div>
              <input
                type="radio"
                id="random"
                name="cabinChoice"
                value="random"
                checked={cabinAssigment === 'random' ? true : false}
                onChange={(event) => setCabinAssigment(event.target.value)}
              />
              <label htmlFor="random">Jeg ønsker tilfeldig tildeling</label>
            </div>
            <div>
              <input
                type="radio"
                id="pickSelf"
                name="cabinChoice"
                value="pickSelf"
                checked={cabinAssigment === 'pickSelf' ? true : false}
                onChange={(event) => setCabinAssigment(event.target.value)}
              />
              <label htmlFor="pickSelf">
                Jeg ønsker å velge mulige hytte(ne)
              </label>
            </div>
          </div>
        )}

        {numberOfCabins > 0 && cabinAssigment === 'pickSelf' && (
          <div className="soknad-step3-cabins">
            {cabins.map((cabin, index) => {
              return (
                <CabinCardSmall
                  key={cabin.name}
                  index={index}
                  cabin={cabin}
                  setPicked={setPickedCabin}
                />
              );
            })}
          </div>
        )}
      </div>
      <div className="soknad-btn">
        <button className="btn small btn-nonActive" onClick={previousPage}>
          Forrige
        </button>
        <button className="btn small" onClick={sendInApplication}>
          Fullfør
        </button>
      </div>
    </>
  );
};

export default Step3;
