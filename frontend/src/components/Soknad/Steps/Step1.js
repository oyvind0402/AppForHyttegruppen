import { BsQuestionCircle, BsExclamationTriangle } from 'react-icons/bs';
import { RiSuitcase2Line, RiSuitcaseLine } from 'react-icons/ri';
import './Steps.css';
import './Step1.css';
import { useEffect, useState } from 'react';

const Step1 = (props) => {
  const [showUserFeedback, setShowUserFeedback] = useState(false);
  const [showaccentureFeedback, setShowAccentureFeedback] = useState(false);

  //Setting values based on props
  useEffect(() => {
    document.querySelector('input[id="name"]').value = props.formData.userId;
    document.querySelector('input[id="EnterpriseID"]').value =
      props.formData.accentureId;

    const tripPurpose = props.formData.tripPurpose;
    if (tripPurpose === 'prosjekt') {
      document.querySelector('input[id="prosjekt"]').checked = true;
    } else {
      document.querySelector('input[id="privat"]').checked = true;
    }
  });

  //Submitting data to parent
  const submitStep1 = () => {
    setShowUserFeedback(false);
    setShowAccentureFeedback(false);
    const newUserId = document.getElementById('name').value;
    const newAccentureId = document.getElementById('EnterpriseID').value;
    const newTripPurpose = document.querySelector(
      'input[name="purpose-trip"]:checked'
    ).value;

    if (newUserId === '') setShowUserFeedback(true);
    if (newAccentureId === '') setShowAccentureFeedback(true);
    const step1Data = {
      userId: newUserId,
      accentureId: newAccentureId,
      tripPurpose: newTripPurpose,
    };

    props.updateForm(step1Data);
    if (newUserId !== '' && newAccentureId !== '') {
      props.nextPage();
    }
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
            <label className="soknad-radio-text" htmlFor="privat">
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
            <label className="soknad-radio-text" htmlFor="prosjekt">
              <RiSuitcaseLine className="soknad-step1-icon" /> Prosjekt
            </label>
          </div>
        </div>

        <div className="step1-input">
          <label className="soknad-label" htmlFor="name">
            Navn:
          </label>
          <input className="soknad-input" type="text" id="name" name="name" />
          {showUserFeedback && (
            <p className="soknad-error step1-error">
              <BsExclamationTriangle /> Dette feltet må fylles ut!
            </p>
          )}

          <label className="soknad-label" htmlFor="EnterpriseID">
            Enterprise ID:
          </label>
          <input
            className="soknad-input"
            type="text"
            id="EnterpriseID"
            name="EnterpriseID"
          />
          {showaccentureFeedback && (
            <p className="soknad-error step1-error">
              <BsExclamationTriangle /> Dette feltet må fylles ut!
            </p>
          )}
        </div>
      </div>

      <div className="soknad-btn">
        <button
          className="btn small btn-nonActive"
          onClick={props.nullstillForm}
        >
          Nullstil
        </button>

        <button className="btn small" onClick={submitStep1}>
          Neste
        </button>
      </div>
    </>
  );
};

export default Step1;
