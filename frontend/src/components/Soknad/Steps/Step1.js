import { BsQuestionCircle } from 'react-icons/bs';
import { RiSuitcase2Line, RiSuitcaseLine } from 'react-icons/ri';
import './Steps.css';
import './Step1.css';

const Step1 = (props) => {
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

        <button className="btn small" onClick={props.nextPage}>
          Neste
        </button>
      </div>
    </>
  );
};

export default Step1;
