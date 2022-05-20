import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import AdminBanner from '../../01-Reusable/HeroBanner/AdminBanner';
import AlertPopup from '../../01-Reusable/PopUp/AlertPopup';
import './EditSeason.css';

const EditSeason = () => {
  const history = useHistory();
  const [season, setSeason] = useState({});
  const [popupVisible, setPopupVisible] = useState(false);
  const [alertPopupVisible, setAlertPopupVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const handleAlertVisibility = () => {
    setAlertPopupVisible(!alertPopupVisible);
  };

  const handleVisibility = () => {
    let _errors = {};
    let enddate = new Date(season.lastDay);
    let startdate = new Date(season.firstDay);
    let applyFrom = new Date(season.applyFrom);
    let applyTo = new Date(season.applyUntil);

    if (enddate < startdate) {
      _errors.end = 'Sluttdato kan ikke være før startdato!';
    }

    if (enddate.toString() === 'Invalid Date') {
      _errors.end = 'Du valgte en ugyldig sluttdato!';
    }

    if (startdate.toString() === 'Invalid Date') {
      _errors.start = 'Du valgte en ugyldig startdato!';
    }

    if (applyFrom.toString() === 'Invalid Date') {
      _errors.applyFrom = 'Du valgte en ugyldig søknadsdato!';
    }

    if (applyTo.toString() === 'Invalid Date') {
      _errors.applyTo = 'Du valgte en ugyldig søknadsfrist!';
    }

    setErrors(_errors);

    if (_errors.end || _errors.start || _errors.applyFrom || _errors.applyTo) {
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

  const editSeason = async () => {
    try {
      const response = await fetch('/api/season/update', {
        method: 'PUT',
        headers: { token: cookies.get('token') },
        body: JSON.stringify(season),
      });

      if (response.ok) {
        setPopupVisible(false);
        //history.push('/admin/endresesonger');
      }
    } catch (error) {
      console.log(error);
    }
    console.log(season);
  };

  const deleteSeason = async () => {
    try {
      const response = await fetch('/api/season/delete', {
        method: 'DELETE',
        headers: { token: cookies.get('token') },
        body: JSON.stringify(id),
      });
      const data = await response.json();
      if (response.ok) {
        if (data > 0) {
          history.replace('/admin/endresesonger');
        } else {
          setAlertPopupVisible(false);
          setErrors('Perioden kunne ikke slettes!');
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    async function fetchSeason() {
      fetch('/api/season/' + id)
        .then((response) => response.json())
        .then((data) => {
          setSeason(data);
        })
        .catch((error) => console.log(error));
    }
    fetchSeason();
  }, [id]);

  return (
    <>
      <BackButton
        name="Tilbake til endre sesonger"
        link="admin/endresesonger"
      />
      <AdminBanner name="Endre sesong" />
      <div className="endreseason-container">
        <div className="edit-season-wrapper">
          <label className="edit-season-title" htmlFor="edit-season-name">
            Navn*
          </label>
          <input
            type="text"
            id="edit-season-name"
            className="edit-season-input"
            defaultValue={season.seasonName}
            disabled
          />
        </div>
        {errors.name && <span className="login-error">{errors.name}</span>}
        <div className="edit-season-wrapper">
          <label className="edit-season-title" htmlFor="edit-season-startdate">
            Startdato*
          </label>
          <input
            type="date"
            id="edit-season-startdate"
            className="edit-season-input"
            value={setDefaultDateValue(season.firstDay)}
            onChange={(e) => {
              if (setDateObject(e.target.value).toString() !== 'Invalid Date') {
                season.firstDay = setDateObject(e.target.value);
                setSeason({ ...season });
              }
            }}
          />
        </div>
        {errors.start && <span className="login-error">{errors.start}</span>}
        <div className="edit-season-wrapper">
          <label className="edit-season-title" htmlFor="edit-season-enddate">
            Sluttdato*
          </label>
          <input
            type="date"
            id="edit-season-enddate"
            className="edit-season-input"
            value={setDefaultDateValue(season.lastDay)}
            onChange={(e) => {
              if (setDateObject(e.target.value).toString() !== 'Invalid Date') {
                season.lastDay = setDateObject(e.target.value);
                setSeason({ ...season });
              }
            }}
          />
        </div>
        {errors.end && <span className="login-error">{errors.end}</span>}
        <div className="edit-season-wrapper">
          <label className="edit-season-title" htmlFor="edit-season-enddate">
            Kan søkes på fra*
          </label>
          <input
            type="date"
            id="edit-season-enddate"
            className="edit-season-input"
            value={setDefaultDateValue(season.applyFrom)}
            onChange={(e) => {
              if (setDateObject(e.target.value).toString() !== 'Invalid Date') {
                season.applyFrom = setDateObject(e.target.value);
                setSeason({ ...season });
              }
            }}
          />
        </div>
        {errors.applyFrom && (
          <span className="login-error">{errors.applyFrom}</span>
        )}
        <div className="edit-season-wrapper">
          <label className="edit-season-title" htmlFor="edit-season-enddate">
            Kan søkes på til*
          </label>
          <input
            type="date"
            id="edit-season-enddate"
            className="edit-season-input"
            value={setDefaultDateValue(season.applyUntil)}
            onChange={(e) => {
              if (setDateObject(e.target.value).toString() !== 'Invalid Date') {
                season.applyUntil = setDateObject(e.target.value);

                setSeason({ ...season });
              }
            }}
          />
        </div>
        {errors.applyTo && (
          <span className="login-error">{errors.applyTo}</span>
        )}
        <div className="seasonbuttons">
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
          title={'Endring av sesong'}
          description={'Er du sikker på at du vil endre sesongen?'}
          acceptMethod={editSeason}
          cancelMethod={handleVisibility}
        />
      )}
      {alertPopupVisible && (
        <AlertPopup
          positiveAction="Ja"
          negativeAction="Nei"
          title="Sletting av sesong"
          description={
            'Er du sikker på at du vil slette sesongen?\n\nDa slettes også alle perioder som er linket til sesongen, og alle søknader som er linket til de periodene!'
          }
          acceptMethod={deleteSeason}
          cancelMethod={handleAlertVisibility}
        />
      )}
    </>
  );
};

export default EditSeason;
