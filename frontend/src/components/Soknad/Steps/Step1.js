import { BsQuestionCircle, BsExclamationTriangle } from 'react-icons/bs';
import { RiSuitcase2Line, RiSuitcaseLine } from 'react-icons/ri';
import './Steps.css';
import './Step1.css';
import { useEffect, useState } from 'react';

const Step1 = (props) => {
  const [showExtraInfo, setShowExtraInfo] = useState(false);
  const [radioPrivatProject, setRadioPrivatProject] = useState(
    props.formData.tripPurpose
  );
  const [ansattnummerWBS, setAnsattnummerWBS] = useState(
    props.formData.ansattnummerWBS
  );
  const [enterpriseId, setEnterpriseId] = useState(props.formData.accentureId);

  const [showCredentialsFeedback, setCredentialsFeedback] = useState(false);
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
    document.querySelector('input[id="credentials"]').value = ansattnummerWBS;
    document.querySelector('input[id="EnterpriseID"]').value = enterpriseId;
  });

  //Submitting data to parent
  const submitStep1 = () => {
    setCredentialsFeedback(false);
    setShowAccentureFeedback(false);

    if (ansattnummerWBS === '') setCredentialsFeedback(true);
    if (enterpriseId === '') setShowAccentureFeedback(true);
    const step1Data = {
      ansattnummerWBS: ansattnummerWBS,
      accentureId: enterpriseId,
      tripPurpose: radioPrivatProject,
    };

    props.updateForm(step1Data);
    if (ansattnummerWBS !== '' && enterpriseId !== '') {
      props.nextPage();
    }
  };

  const handleTypeTrip = (e) => {
    setRadioPrivatProject(e.target.value);
    setAnsattnummerWBS('');
    setEnterpriseId(document.getElementById('EnterpriseID').value);
  };

  const handleEnterpriseId = (e) => {
    setEnterpriseId(e.target.value);
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
              checked={radioPrivatProject === 'Privat'}
              onChange={(e) => handleTypeTrip(e)}
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
              checked={radioPrivatProject === 'Prosjekt'}
              onChange={(e) => handleTypeTrip(e)}
            />
            <label className="soknad-radio-text" htmlFor="prosjekt">
              <RiSuitcaseLine className="soknad-step1-icon" /> Prosjekt
            </label>
          </div>
        </div>

        <div className="step1-input">
          {radioPrivatProject === 'Privat' ? (
            <>
              {' '}
              <label className="soknad-label" htmlFor="credentials">
                Ansattnummer:
              </label>
              <input
                className="soknad-input"
                type="text"
                id="credentials"
                name="credentials"
                onChange={(e) => setAnsattnummerWBS(e.target.value)}
              />
            </>
          ) : (
            <>
              {' '}
              <label className="soknad-label" htmlFor="credentials">
                WBS:
              </label>
              <input
                className="soknad-input"
                type="text"
                id="credentials"
                name="credentials"
                onChange={(e) => setAnsattnummerWBS(e.target.value)}
              />
            </>
          )}

          {showCredentialsFeedback && (
            <p className="soknad-error step1-error">
              <BsExclamationTriangle /> Dette feltet må fylles ut!
            </p>
          )}

          {/*Når login løsningn er implementert kan dette feltet fylles ut automatisk*/}
          <label className="soknad-label" htmlFor="EnterpriseID">
            Enterprise ID:
          </label>
          <input
            className="soknad-input"
            type="text"
            id="EnterpriseID"
            name="EnterpriseID"
            onChange={(e) => setEnterpriseId(e.target.value)}
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
