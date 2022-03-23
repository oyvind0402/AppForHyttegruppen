import { BsQuestionCircle } from 'react-icons/bs';
import { RiSuitcase2Line, RiSuitcaseLine } from 'react-icons/ri';
import './Steps.css';
import './Step1.css';
import { useEffect, useState } from 'react';

const Step1 = (props) => {
  console.log(props.formData);

  useEffect(() => {
    document.querySelector('input[id="name"]').value = props.formData.UserID;
    document.querySelector('input[id="EnterpriseID"]').value =
      props.formData.AccentureId;

    const TripPurpose = props.formData.TripPurpose;
    if (TripPurpose === 'prosjekt') {
      document.querySelector('input[id="prosjekt"]').checked = true;
    } else {
      document.querySelector('input[id="privat"]').checked = true;
    }
  });

  const submitStep1 = () => {
    const newUserId = document.getElementById('name').value;
    const newAccentureId = document.getElementById('EnterpriseID').value;
    const newTripPurpose = document.querySelector(
      'input[name="purpose-trip"]:checked'
    ).value;

    const step1Data = {
      UserId: newUserId,
      AccentureId: newAccentureId,
      TripPurpose: newTripPurpose,
    };

    props.nextPage(step1Data);
  };

  return (
    <>
      <div className="step-soknad">
        <div className="stepQuestion">
          <BsQuestionCircle className="soknad-question-icon" />
          <p className="soknad-question-text">Hva er grunnen for oppholdet</p>
        </div>

        <div className="soknad-purpose">
          <div>
            <input
              className="soknad-radio"
              type="radio"
              id="privat"
              name="purpose-trip"
              value="privat"
              onChange={(e) => e.target}
            />
            <label className="soknad-radio-text" for="privat">
              <RiSuitcase2Line className="soknad-step1-icon" />
              Privat
            </label>
          </div>
          <div>
            <input
              className="soknad-radio"
              type="radio"
              id="prosjekt"
              name="purpose-trip"
              value="prosjekt"
              onChange={(e) => e.target}
            />
            <label className="soknad-radio-text" for="prosjekt">
              <RiSuitcaseLine className="soknad-step1-icon" /> Prosjekt
            </label>
          </div>
        </div>

        <div className="step1-input">
          <label className="soknad-label" for="name">
            Navn:
          </label>
          <input className="soknad-input" type="text" id="name" name="name" />

          <label className="soknad-label" for="EnterpriseID">
            Enterprise ID:
          </label>
          <input
            className="soknad-input"
            type="text"
            id="EnterpriseID"
            name="EnterpriseID"
          />
        </div>
      </div>
      <div className="soknad-btn">
        <button
          className="btn small btn-nonActive"
          onClick={props.nullstillForm}
        >
          Avbryt
        </button>

        <button className="btn small" onClick={submitStep1}>
          Neste
        </button>
      </div>
    </>
  );
};

export default Step1;
