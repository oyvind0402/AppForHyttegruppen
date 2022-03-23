import { useEffect, useState } from 'react';
import { BsQuestionCircle } from 'react-icons/bs';
import './Steps.css';
import './Step2.css';

const Step2 = (props) => {
  console.log(props.formData);

  const perioder = [
    {
      id: 1,
      Name: 'Uke 12',
      Season: 'winter',
      Start: '21-03-2022',
      End: '28-03-2022',
    },
    {
      id: 2,
      Name: 'Uke 13',
      Season: 'winter',
      Start: '28-03-2022',
      End: '04-04-2022',
    },
    {
      id: 3,
      Name: 'Uke 14',
      Season: 'winter',
      Start: '04-04-2022',
      End: '11-04-2022',
    },
    {
      id: 4,
      Name: 'Uke 15',
      Season: 'winter',
      Start: '11-04-2022',
      End: '18-04-2022',
    },
    {
      id: 5,
      Name: 'Uke 16',
      Season: 'winter',
      Start: '11-04-2022',
      End: '18-04-2022',
    },
    {
      id: 6,
      Name: 'Uke 17',
      Season: 'winter',
      Start: '11-04-2022',
      End: '18-04-2022',
    },
    {
      id: 7,
      Name: 'Uke 18',
      Season: 'winter',
      Start: '11-04-2022',
      End: '18-04-2022',
    },
  ];

  //Removing prev picked periods from possible periods
  const newMuligePerioder = perioder.filter((period) => {
    let match = false;
    for (let i = 0; i < props.formData.Period.length; i++) {
      if (props.formData.Period[i].id === period.id) match = true;
    }
    if (!match) return period;
  });

  const [muligePerioder, setMuligePerioder] = useState(newMuligePerioder);
  const [valgtePerioder, setValgtePerioder] = useState(props.formData.Period);

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

  const removePerioder = () => {
    let newMuligePerioderRemove = muligePerioder;
    let newValgtePerioderRemove = [];
    let checkboxes = document.querySelectorAll('.remove-checkbox');
    console.log(checkboxes);

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

  const uncheckAllBoxes = () => {
    let checkedboxes = document.querySelectorAll('input:checked');
    checkedboxes.forEach((checkbox) => (checkbox.checked = false));
  };

  const submitStep2 = () => {
    props.nextPage(valgtePerioder);
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
                    {period.Name} ({period.Start} - {period.End})
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
                    {period.Name} ({period.Start} - {period.End})
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
//<Period period={period} key={index} />
