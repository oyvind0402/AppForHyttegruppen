import { useEffect, useState } from 'react';
import { BsQuestionCircle, BsExclamationTriangle } from 'react-icons/bs';
import './Steps.css';
import './Step2.css';

const Step2 = (props) => {
  const [showExtraInfo, setShowExtraInfo] = useState(false);
  const [tempPerioder, setTempPerioder] = useState([]);
  const [perioder, setPerioder] = useState([]);
  const [muligePerioder, setMuligePerioder] = useState([]);
  const [valgtePerioder, setValgtePerioder] = useState(props.formData.period);
  const [showFeedBack, setShowFeedBack] = useState(false);

  //Fetching all periods
  useEffect(() => {
    async function fetchData() {
      fetch('/api/period/inseason/open')
        .then((response) => response.json())
        .then((data) => {
          //setPerioder(data);
          setTempPerioder(data);
        })
        .catch((error) => console.log(error));
    }
    fetchData();
  }, []);

  //Fetching all previous applied periods
  useEffect(() => {
    let newMuligePerioder = [];

    async function fetchAlreadyAplliedPeriods() {
      fetch(`/api/application/byuser/${props.formData.userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data !== null) {
            newMuligePerioder = tempPerioder.filter((period) => {
              let match = false;
              for (let i = 0; i < data.length; i++) {
                if (data[i].period.id === period.id) match = true;
              }
              if (!match) return period;
              return '';
            });
            setPerioder(newMuligePerioder);
          } else {
            setPerioder(tempPerioder);
          }
        })
        .catch((error) => console.log(error));
    }
    fetchAlreadyAplliedPeriods();
  }, [tempPerioder, props.formData.userId]);

  //Everytime perioder updates we remove all the periods that are previously selected (saved in props)
  useEffect(() => {
    let newMuligePerioder = [];

    if (perioder !== []) {
      newMuligePerioder = perioder.filter((period) => {
        let match = false;
        for (let i = 0; i < props.formData.period.length; i++) {
          if (props.formData.period[i].id === period.id) match = true;
        }
        if (!match) return period;
        return '';
      });
      setMuligePerioder(newMuligePerioder);
    }
  }, [perioder, props.formData.period]);

  //Add periods to 'Valgete perioder' box and removes them from 'Perioder'
  const addPerioder = () => {
    const newMuligePeridoer = [];
    const newValgtePerioder = valgtePerioder;
    let checkboxes = document.querySelectorAll('.add-checkbox');

    for (let i = 0; i < muligePerioder.length; i++) {
      if (checkboxes[i].checked) {
        newValgtePerioder.push(muligePerioder[i]);
      } else {
        newMuligePeridoer.push(muligePerioder[i]);
      }
    }

    setMuligePerioder(newMuligePeridoer);
    setValgtePerioder(newValgtePerioder);
    uncheckAllBoxes(); //Some boxes remain checked after switching of the periods
  };

  //Removes periods from 'Valgte perioder' and adds them to Perioder
  const removePerioder = () => {
    let newMuligePerioderRemove = muligePerioder;
    let newValgtePerioderRemove = [];
    let checkboxes = document.querySelectorAll('.remove-checkbox');

    for (let i = 0; i < valgtePerioder.length; i++) {
      if (checkboxes[i].checked) {
        newMuligePerioderRemove.push(valgtePerioder[i]);
      } else {
        newValgtePerioderRemove.push(valgtePerioder[i]);
      }
    }
    setMuligePerioder(newMuligePerioderRemove);
    setValgtePerioder(newValgtePerioderRemove);
    uncheckAllBoxes();
  };

  //Uncheck checkboxes
  //When a period is added the check class is transferd to the next in line which should be removed
  const uncheckAllBoxes = () => {
    let checkedboxes = document.querySelectorAll('input:checked');
    checkedboxes.forEach((checkbox) => (checkbox.checked = false));
  };

  const submitStep2 = () => {
    setShowFeedBack(false);
    props.updateForm(valgtePerioder);
    if (valgtePerioder.length === 0) {
      setShowFeedBack(true);
      return;
    }
    props.nextPage();
  };

  //Converts the dates received from the backend to day.month.year
  const changeDate = (date) => {
    if (typeof date !== 'undefined') {
      date = date.replace('T00:00:00Z', '');
      const dates = date.split('-');
      return dates[2] + '.' + dates[1] + '.' + dates[0];
    }
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
            aria-label="More information"
            role="button"
          />
          <p className="soknad-question-text">Velg perioder du vil søke på</p>
        </button>
        {showExtraInfo && (
          <div className="step-extra-info-div">
            <p className="step-extra-info-p">
              Du kan kun søke en gang per periode.
            </p>
            <p className="step-extra-info-p">
              Har du gjort en feil? Da kan du avbestille turen under min tur og
              deretter søke på nytt.
            </p>
          </div>
        )}

        <div>
          <div>
            <h2 className="input-header">Perioder</h2>
            <div className="perioder-input">
              {muligePerioder.length > 0 ? (
                muligePerioder.map((period, index) => (
                  <div className="soknad-step2-period" key={index}>
                    <input
                      className="soknad-step2-checkbox add-checkbox"
                      type="checkbox"
                      id={period.id}
                      name={period.id}
                      tabIndex={'0'}
                      onKeyPress={(e) => {
                        e.target.checked = !e.target.checked;
                      }}
                    />
                    <label className="soknad-step2-label" htmlFor={period.id}>
                      {period.name} ({changeDate(period.start)} -{' '}
                      {changeDate(period.end)})
                    </label>
                  </div>
                ))
              ) : (
                <p>Ingen perioder funnet</p>
              )}
            </div>
          </div>
          <div className="soknad-step2-btns">
            <button className="btn small step2-btn-add" onClick={addPerioder}>
              Legg til
            </button>
            <button
              className="btn small step2-btn-remove btn-nonActive"
              onClick={removePerioder}
            >
              Fjern
            </button>
          </div>

          <div>
            <h2 className="input-header">Valgte perioder*</h2>
            {showFeedBack && (
              <p className="soknad-error step2-error">
                <BsExclamationTriangle aria-label="warning" /> Husk å legge til
                perioder!
              </p>
            )}
            <div className="perioder-input">
              {valgtePerioder.map((period, index) => (
                <div className="soknad-step2-period" key={period.id}>
                  <input
                    className="soknad-step2-checkbox remove-checkbox"
                    type="checkbox"
                    id={period.id}
                    name={period.id}
                  />
                  <label className="soknad-step2-label" htmlFor={period.id}>
                    {period.name} ({changeDate(period.start)} -{' '}
                    {changeDate(period.end)})
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="soknad-btn">
        <button
          className="btn small btn-nonActive"
          onClick={props.previousPage}
        >
          Forrige
        </button>
        <button className="btn small" onClick={submitStep2}>
          Neste
        </button>
      </div>
    </>
  );
};

export default Step2;
