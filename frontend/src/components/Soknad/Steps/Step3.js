import { useContext, useEffect, useState } from 'react';
import { BsQuestionCircle } from 'react-icons/bs';
import CabinCardSmall from './../../01-Reusable/CabinCard/CabinCardSmall';

import './Steps.css';
import './Step3.css';

const Step3 = (props) => {
  console.log(props.formData);

  useEffect(() => {
    document.querySelector('input[id="numberOfHytter"]').value =
      props.formData.NumberOfCabins;

    const assigment = props.formData.Assigment;
    if (assigment === 'pickSelf') {
      document.querySelector('input[id="pickSelf"]').checked = true;
    } else {
      document.querySelector('input[id="random"]').checked = true;
    }

    //Cabin checked wait until we have the abin structure
  });

  return (
    <>
      <div className="step-soknad">
        <div className="stepQuestion">
          <BsQuestionCircle className="soknad-question-icon" />
          <p className="soknad-question-text">Velg hytter</p>
        </div>
        <div className="soknad-step3-antall">
          <label className="soknad-label" for="numberOfHytter">
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
            <label for="random">Jeg ønsker tilfeldig tildeling</label>
          </div>
          <div>
            <input
              type="radio"
              id="pickSelf"
              name="cabinChoice"
              value="pickSelf"
            />
            <label for="pickSelf">Jeg ønsker å velge hytte(ne)</label>
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
        <button
          className="btn small btn-nonActive"
          onClick={props.previousPage}
        >
          Forrige
        </button>
        <button className="btn small" onClick={props.completeForm}>
          Fullfør
        </button>
      </div>
    </>
  );
};

export default Step3;
