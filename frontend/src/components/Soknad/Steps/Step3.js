import { useEffect } from 'react';
import { BsQuestionCircle } from 'react-icons/bs';
import CabinCardSmall from './../../01-Reusable/CabinCard/CabinCardSmall';

import './Steps.css';
import './Step3.css';

const Step3 = (props) => {
  //Loading values based on props
  useEffect(() => {
    document.querySelector('input[id="numberOfHytter"]').value =
      props.formData.numberOfCabins;

    const cabinAssigment = props.formData.cabinAssigment;
    if (cabinAssigment === 'pickSelf') {
      document.querySelector('input[id="pickSelf"]').checked = true;
    } else {
      document.querySelector('input[id="random"]').checked = true;
    }

    //Cabin checked wait until we have the cabin structure
  });

  //Getting current input data
  const getCurrentData = () => {
    const numberOfHytter = parseInt(
      document.getElementById('numberOfHytter').value
    );
    const cabinChoice = document.querySelector(
      'input[name="cabinChoice"]:checked'
    ).value;

    let valgteCabins = [];

    if (cabinChoice === 'random') {
      //Add all cabins
    } else {
      //Add checked cabins
    }

    const step3Data = {
      numberOfCabins: numberOfHytter,
      cabinAssigment: cabinChoice,
      cabins: valgteCabins,
    };

    return step3Data;
  };

  const previousPage = () => {
    const step3Data = getCurrentData();
    props.previousPage(step3Data);
  };

  const sendInApplication = () => {
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
            name="numberOfHytter"
            min="1"
            max="4"
          />

          <p className="soknad-step3-next">{'>'}</p>
        </div>
        <div className="soknad-step3-antall">
          <div>
            <input type="radio" id="random" name="cabinChoice" value="random" />
            <label htmlFor="random">Jeg ønsker tilfeldig tildeling</label>
          </div>
          <div>
            <input
              type="radio"
              id="pickSelf"
              name="cabinChoice"
              value="pickSelf"
            />
            <label htmlFor="pickSelf">Jeg ønsker å velge hytte(ne)</label>
            <p className="soknad-step3-next">{'>'}</p>
          </div>
        </div>
        <div className="soknad-step3-cabins">
          <CabinCardSmall />
          <CabinCardSmall />
          <CabinCardSmall />
          <CabinCardSmall />
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
