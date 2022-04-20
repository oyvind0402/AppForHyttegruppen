import { BsQuestionCircle, BsExclamationTriangle } from 'react-icons/bs';
import { RiSuitcase2Line, RiSuitcaseLine } from 'react-icons/ri';
import './Steps.css';
import './Step1.css';
import { useEffect, useState } from 'react';

const Step1 = (props) => {
  const [showExtraInfo, setShowExtraInfo] = useState(false);
  const [showUserFeedback, setShowUserFeedback] = useState(false);
  const [showaccentureFeedback, setShowAccentureFeedback] = useState(false);
  const [cabins, setCabins] = useState([]);

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

  //Setting values based on props
  useEffect(() => {
    document.querySelector('input[id="name"]').value = props.formData.userId;
    document.querySelector('input[id="EnterpriseID"]').value =
      props.formData.accentureId;

    const tripPurpose = props.formData.tripPurpose;
    if (tripPurpose === 'Prosjekt') {
      document.querySelector('input[id="prosjekt"]').checked = true;
    } else {
      document.querySelector('input[id="privat"]').checked = true;
    }
  });

  //Submitting data to parent
  const submitStep1 = () => {
    setShowUserFeedback(false);
    setShowAccentureFeedback(false);
    const newUserId = localStorage.getItem('userID');
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
        <div
          className="stepQuestion"
          onClick={() => setShowExtraInfo(!showExtraInfo)}
        >
          <BsQuestionCircle className="soknad-question-icon" />
          <p className="soknad-question-text">Hva er grunnen for oppholdet</p>
        </div>
        {showExtraInfo && (
          <div className="step-extra-info-div">
            <p className="step-extra-info-p">
              Dersom du søker på et prosjekt må du fylle ut ???
            </p>
            <p className="step-extra-info-p">
              EnterpriseID er din epost uten @accenture.com
            </p>
          </div>
        )}

        <div className="soknad-purpose">
          <div>
            <input
              className="soknad-radio"
              type="radio"
              id="privat"
              name="purpose-trip"
              value="Privat"
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
              value="Prosjekt"
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
      <br />
      <table className="step1-table">
        <thead>
          <tr>
            <th>Hytte</th>
            <th>Leie pris</th>
            <th>Vasking</th>
          </tr>
        </thead>
        <tbody>
          {cabins.map((cabin, index) => {
            return (
              <tr key={index}>
                <td>{cabin.name}</td>
                <td>{cabin.price} NOK</td>
                <td>{cabin.cleaningPrice} NOK</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="soknad-btn">
        <button
          className="btn small btn-nonActive"
          onClick={props.nullstillForm}
        >
          Nullstill
        </button>

        <button className="btn small" onClick={submitStep1}>
          Neste
        </button>
      </div>
    </>
  );
};

export default Step1;
