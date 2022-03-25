import { useEffect, useState } from 'react';
import { BsQuestionCircle } from 'react-icons/bs';
import './Steps.css';
import './Step2.css';

const Step2 = (props) => {
  const [perioder, setPerioder] = useState([]);
  let newMuligePerioder = [];
  const [muligePerioder, setMuligePerioder] = useState([]);
  const [valgtePerioder, setValgtePerioder] = useState(props.formData.period);

  //Fetching
  useEffect(async () => {
    fetch('http://localhost:8080/period/getall')
      .then((response) => response.json())
      .then((data) => setPerioder(data))
      .catch((error) => console.log(error));
  }, []);

  //Everytime perioder updates we run leggTilPerioder
  useEffect(() => {
    if (perioder != []) removePerioderBasedOnProps();
  }, [perioder]);

  //Divides periods based on previously saved preferenses
  const removePerioderBasedOnProps = () => {
    newMuligePerioder = perioder.filter((period) => {
      let match = false;
      for (let i = 0; i < props.formData.period.length; i++) {
        if (props.formData.period[i].id === period.id) match = true;
      }
      if (!match) return period;
    });
    setMuligePerioder(newMuligePerioder);
  };

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
    props.nextPage(valgtePerioder);
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
        <div className="stepQuestion">
          <BsQuestionCircle className="soknad-question-icon" />
          <p className="soknad-question-text">Velg perioder du vil søke på</p>
        </div>

        <div>
          <div>
            <h3 className="input-header">Perioder</h3>
            <div className="perioder-input">
              {muligePerioder.map((period, index) => (
                <div className="soknad-step2-period" key={index}>
                  <input
                    className="soknad-step2-checkbox add-checkbox"
                    type="checkbox"
                    id={period.id}
                    name={period.id}
                  />
                  <label className="soknad-step2-label" for={period.id}>
                    {period.name} ({changeDate(period.start)} -{' '}
                    {changeDate(period.end)})
                  </label>
                </div>
              ))}
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
            <h3 className="input-header">Valgte perioder</h3>
            <div className="perioder-input">
              {valgtePerioder.map((period, index) => (
                <div className="soknad-step2-period" key={period.id}>
                  <input
                    className="soknad-step2-checkbox remove-checkbox"
                    type="checkbox"
                    id={period.id}
                    name={period.id}
                  />
                  <label className="soknad-step2-label" for={period.id}>
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
