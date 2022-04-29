import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import HeroBanner from '../../01-Reusable/HeroBanner/HeroBanner';
import AlertPopup from '../../01-Reusable/PopUp/AlertPopup';
import './EditPeriod.css';

const EditPeriod = () => {
  const history = useHistory();
  const [period, setPeriod] = useState({});
  const [seasons, setSeasons] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const handleVisibility = () => {
    let _errors = {};
    let end = new Date(period.end);
    let start = new Date(period.start);
    if (period.name.length === 0) {
      _errors.name = 'Du må fylle inn et navn!';
    }
    if (end < start) {
      _errors.end = 'Sluttdato kan ikke være før startdato!';
    }

    if (end.toString === 'Invalid Date') {
      _errors.end = 'Du valgte en ugyldig sluttdato!';
    }

    if (start.toString === 'Invalid Date') {
      _errors.start = 'Du valgte en ugyldig startdato!';
    }

    setErrors(_errors);

    if (_errors.name || _errors.end || _errors.start) {
      setPopupVisible(false);
      return;
    }

    setErrors({});
    setPopupVisible(!popupVisible);
  };

  const link = window.location.href;
  let id = link.split('/')[5];

  const fetchPeriod = async () => {
    const response = await fetch('/period/' + id);
    const data = await response.json();
    if (response.ok) {
      setPeriod(data);
    }
  };

  const fetchSeasons = async () => {
    const response = await fetch('/season/all');
    const data = await response.json();
    if (response.ok) {
      setSeasons(data);
    }
  };

  /**
   * @param {*} date A date in string format
   * @returns A date object made from the parameter
   */
  const setDateObject = (date) => {
    const newDate = new Date(date);
    return newDate;
  };

  /**
   * @param {*} date A date
   * @returns A date in string format
   */
  const setDefaultDateValue = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString('en-CA');
  };

  const editPeriod = async () => {
    let seasonName = document.getElementById('edit-period-select').value;

    seasons.forEach((season) => {
      if (season.seasonName === seasonName) {
        period.season = season;
      }
    });

    const response = await fetch('/period/update', {
      method: 'PUT',
      headers: { token: localStorage.getItem('refresh_token') },
      body: JSON.stringify(period),
    });

    if (response.ok) {
      setPopupVisible(false);
      history.push('/admin/endreperioder');
    }
  };

  useEffect(() => {
    fetchPeriod();
    fetchSeasons();
  }, []);

  return (
    <>
      <BackButton
        name="Tilbake til endre perioder"
        link="admin/endreperioder"
      />
      <HeroBanner name="Endre periode" />
      <div className="endreperiode-container">
        <div className="edit-input-wrapper">
          <p className="edit-period-title">Navn</p>
          <input
            type="text"
            id="edit-period-name"
            className="edit-period-input"
            defaultValue={period.name}
            onChange={(e) => {
              period.name = e.target.value;
              setPeriod({ ...period });
            }}
          />
          {errors.name && <span className="login-error">{errors.name}</span>}
        </div>

        <div className="edit-input-wrapper">
          <p className="edit-period-title">Startdato</p>
          <input
            type="date"
            id="edit-period-startdate"
            className="edit-period-input"
            value={setDefaultDateValue(period.start)}
            onChange={(e) => {
              if (setDateObject(e.target.value).toString() !== 'Invalid Date') {
                period.start = setDateObject(e.target.value);
                setPeriod({ ...period });
              }
            }}
          />
          {errors.start && <span className="login-error">{errors.start}</span>}
        </div>

        <div className="edit-input-wrapper">
          <p className="edit-period-title">Sluttdato</p>
          <input
            type="date"
            id="edit-period-enddate"
            className="edit-period-input"
            value={setDefaultDateValue(period.end)}
            onChange={(e) => {
              if (setDateObject(e.target.value).toString() !== 'Invalid Date') {
                period.end = setDateObject(e.target.value);
                setPeriod({ ...period });
              }
            }}
          />
          {errors.end && <span className="login-error">{errors.end}</span>}
        </div>

        <div className="edit-input-wrapper">
          <p className="edit-period-title">Sesong</p>
          <select className="edit-period-input" id="edit-period-select">
            {typeof seasons !== 'undefined' &&
              seasons.map((season, index) => {
                if (season.seasonName === period.season.seasonName) {
                  return (
                    <option value={season.seasonName} key={index} selected>
                      {season.seasonName}
                    </option>
                  );
                } else {
                  return (
                    <option value={season.seasonName} key={index}>
                      {season.seasonName}
                    </option>
                  );
                }
              })}
          </select>
        </div>

        <button onClick={handleVisibility} className="btn big">
          Endre
        </button>
      </div>
      {popupVisible && (
        <AlertPopup
          positiveAction="Ja"
          negativeAction="Nei"
          title={'Endring av periode'}
          description={'Er du sikker på at du vil endre perioden?'}
          acceptMethod={editPeriod}
          cancelMethod={handleVisibility}
        />
      )}
    </>
  );
};

export default EditPeriod;