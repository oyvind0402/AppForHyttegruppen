import { useEffect, useState } from 'react';
import { BsQuestionCircle, BsExclamationTriangle } from 'react-icons/bs';
import CabinCardSmall from './../../01-Reusable/CabinCard/CabinCardSmall';
import './Steps.css';
import './Step3.css';

const Step3 = (props) => {
  const [showExtraInfo, setShowExtraInfo] = useState(false);

  const [numberOfCabins, setNumberOfCabins] = useState(
    props.formData.numberOfCabins
  );
  const [cabinAssigment, setCabinAssigment] = useState(
    props.formData.cabinAssigment
  );
  const [kommentar, setKommentar] = useState(props.formData.kommentar);
  const [showFeedBackNumber, setShowFeedBackNumber] = useState(false);
  const [showFeedbackAssignment, setShowFeedbackAssignment] = useState(false);
  const [showFeedbackCabins, setShowFeedbackCabins] = useState(false);

  const [cabins, setCabins] = useState([]);
  const [pickedCabins, setPickedCabins] = useState([]);

  let valgteCabins = [];
  //Fetching
  useEffect(() => {
    async function fetchData() {
      fetch('/api/cabin/active')
        .then((response) => response.json())
        .then((data) => setCabins(data))
        .catch((error) => console.log(error));
    }
    if (cabins.length === 0) {
      fetchData();
    }
  }, [cabins]);

  //No cabin is picked yet
  useEffect(() => {
    if (pickedCabins.length === 0 && cabins.length > 0) {
      let newPickedCabins = [];
      cabins.forEach(() => {
        newPickedCabins.push(false);
      });
      setPickedCabins(newPickedCabins);
    }
  }, [cabins, pickedCabins]);

  function updatePickedCabin(picked, index) {
    pickedCabins[index] = picked;
    setShowFeedbackCabins(false);
  }

  //Getting current input data
  const getCurrentData = () => {
    if (cabinAssigment === 'Tilfeldig') {
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
      kommentar: kommentar,
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

    if (cabinAssigment === 'random') {
      setShowFeedbackAssignment(true);
      return;
    }

    const step3Data = getCurrentData();
    if (cabinAssigment === 'Spesifikk' && valgteCabins.length === 0) {
      setShowFeedbackCabins(true);
      return;
    }
    props.completeForm(step3Data);
  };

  return (
    <>
      <div className="step-soknad">
        <button
          className="stepQuestion"
          onClick={() => setShowExtraInfo(!showExtraInfo)}
        >
          <BsQuestionCircle
            className="soknad-question-icon"
            aria-label="more information"
          />
          <p className="soknad-question-text">Velg hytter</p>
        </button>
        {showExtraInfo && (
          <div className="step-extra-info-div">
            <p className="step-extra-info-p">
              Tilfeldig tildeling betyr at du søker på alle hyttene.
            </p>
            <p className="step-extra-info-p">
              Dersom du ønsker å velge selv kan du velge de hyttene som du vil
              søke på og utelukke de som du ikke vil ha.
            </p>
          </div>
        )}

        <div className="soknad-step3-antall">
          <label className="soknad-label" htmlFor="numberOfHytter">
            Ønsket antall hytter*
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
              <BsExclamationTriangle aria-label="warning" /> Husk å legge til
              antall hytter!
            </p>
          )}

          {numberOfCabins > 0 && (
            <div className="step3-radio">
              <p className="soknad-label">Velg alle eller velg selv:*</p>
              <div>
                <input
                  type="radio"
                  id="random"
                  name="cabinChoice"
                  value="Tilfeldig"
                  checked={cabinAssigment === 'Tilfeldig' ? true : false}
                  onChange={(event) => {
                    setCabinAssigment(event.target.value);
                    setShowFeedbackAssignment(false);
                    setShowFeedbackCabins(false);
                  }}
                />
                <label htmlFor="random">Jeg ønsker å søke på alle hytter</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="pickSelf"
                  name="cabinChoice"
                  value="Spesifikk"
                  checked={cabinAssigment === 'Spesifikk' ? true : false}
                  onChange={(event) => {
                    setCabinAssigment(event.target.value);
                    setShowFeedbackAssignment(false);
                    setShowFeedbackCabins(false);
                  }}
                />
                <label htmlFor="pickSelf">
                  Jeg ønsker å velge hyttene selv
                </label>
              </div>
              {showFeedbackAssignment && (
                <p className="soknad-error">
                  <BsExclamationTriangle aria-label="warning" /> Du må velge
                  type tildeling!
                </p>
              )}
            </div>
          )}

          {numberOfCabins > 0 && cabinAssigment === 'Spesifikk' && (
            <p className="soknad-label">Velg hytte(ne):*</p>
          )}
        </div>

        {numberOfCabins > 0 && cabinAssigment === 'Spesifikk' && (
          <>
            <div className="soknad-step3-cabins">
              {cabins.map((cabin, index) => {
                return (
                  <CabinCardSmall
                    key={cabin.name}
                    index={index}
                    cabin={cabin}
                    updatePickedCabin={updatePickedCabin}
                  />
                );
              })}
            </div>
            {showFeedbackCabins && (
              <p className="soknad-error soknad-error-cabins">
                <BsExclamationTriangle aria-label="warning" /> Du må velge minst
                en hytte!
              </p>
            )}
          </>
        )}
        <div className="soknad-step3-antall">
          <label className="soknad-label" htmlFor="comments">
            Kommentar
          </label>
          <textarea
            className="soknad-input"
            name="comments"
            id="comments"
            value={kommentar}
            placeholder="Skriv gjerne hytteprioritet eller spesifikke ønsker hvis du vil.."
            onChange={(e) => setKommentar(e.target.value)}
          />
        </div>
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
