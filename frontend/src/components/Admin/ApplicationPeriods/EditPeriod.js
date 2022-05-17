import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import AdminBanner from '../../01-Reusable/HeroBanner/AdminBanner';
import AlertPopup from '../../01-Reusable/PopUp/AlertPopup';
import './EditPeriod.css';

const EditPeriod = () => {
  const history = useHistory();
  const [period, setPeriod] = useState({});
  const [seasons, setSeasons] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [alertPopupVisible, setAlertPopupVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const handleAlertVisibility = () => {
    setAlertPopupVisible(!alertPopupVisible);
  };

  const handleVisibility = () => {
    let _errors = {};
    let end = new Date(period.end);
    let start = new Date(period.start);
    if (period.name.length === 0) {
      _errors.name = 'Du må fylle inn et navn!';
    }
    if (end <= start) {
      _errors.end = 'Sluttdato kan ikke være før eller samtidig som startdato!';
    }

    if (end.toString() === 'Invalid Date') {
      _errors.end = 'Du valgte en ugyldig sluttdato!';
    }

    if (start.toString() === 'Invalid Date') {
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

  const cookies = new Cookies();

  const editPeriod = async () => {
    let seasonName = document.getElementById('select-period').value;

    seasons.forEach((season) => {
      if (season.seasonName === seasonName) {
        period.season = season;
      }
    });

    try {
      const response = await fetch('/api/period/update', {
        method: 'PUT',
        headers: { token: cookies.get('token') },
        body: JSON.stringify(period),
      });

      if (response.ok) {
        setPopupVisible(false);
        history.push('/admin/endreperioder');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePeriod = async () => {
    try {
      const response = await fetch('/api/period/delete', {
        method: 'DELETE',
        headers: { token: cookies.get('token') },
        body: JSON.stringify(parseInt(id)),
      });
      const data = await response.json();
      if (response.ok) {
        if (data > 0) {
          history.replace('/admin/endreperioder');
        } else {
          setAlertPopupVisible(false);
          setErrors('Perioden kunne ikke slettes!');
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    async function fetchPeriod() {
      fetch('/api/period/' + id)
        .then((response) => response.json())
        .then((data) => {
          setPeriod(data);
        })
        .catch((error) => console.log(error));
    }

    async function fetchSeasons() {
      fetch('/api/season/all')
        .then((response) => response.json())
        .then((data) => {
          setSeasons(data);
        })
        .catch((error) => console.log(error));
    }

    fetchPeriod();
    fetchSeasons();
  }, [id]);

  return (
    <>
      <BackButton
        name="Tilbake til endre perioder"
        link="admin/endreperioder"
      />
      <AdminBanner name="Endre periode" />
      <div className="endreperiode-container">
        <div className="edit-input-wrapper">
          <label className="edit-period-title" htmlFor="edit-period-name">
            Navn*
          </label>
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
        </div>
        {errors.name && <span className="login-error">{errors.name}</span>}
        <div className="edit-input-wrapper">
          <label className="edit-period-title" htmlFor="edit-period-startdate">
            Startdato*
          </label>
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
        </div>
        {errors.start && <span className="login-error">{errors.start}</span>}
        <div className="edit-input-wrapper">
          <label className="edit-period-title" htmlFor="edit-period-enddate">
            Sluttdato*
          </label>
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
        </div>
        {errors.end && <span className="login-error">{errors.end}</span>}
        <div className="edit-input-wrapper">
          <label className="edit-period-title" htmlFor='select-period"'>
            Sesong*
            <br />
            <select className="edit-period-input" id="select-period">
              {seasons !== null &&
                typeof seasons !== 'undefined' &&
                typeof period.season !== 'undefined' &&
                period !== null &&
                typeof period.season.seasonName !== undefined &&
                seasons.map((season, index) => {
                  if (season.seasonName === period.season.seasonName) {
                    return (
                      <option
                        value={season.seasonName}
                        key={index}
                        defaultValue={true}
                      >
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
          </label>
        </div>

        <div className="periodbuttons">
          <button onClick={handleVisibility} className="btn-smaller">
            Endre
          </button>
          <button onClick={handleAlertVisibility} className="btn-smaller">
            Slett
          </button>
        </div>
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
      {alertPopupVisible && (
        <AlertPopup
          positiveAction="Ja"
          negativeAction="Nei"
          title="Sletting av periode"
          description={
            'Er du sikker på at du vil slette perioden?\n\nDa slettes også alle søknader som er linket til perioden!'
          }
          acceptMethod={deletePeriod}
          cancelMethod={handleAlertVisibility}
        />
      )}
    </>
  );
};

export default EditPeriod;
