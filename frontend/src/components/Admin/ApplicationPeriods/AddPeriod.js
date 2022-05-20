import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import AdminBanner from '../../01-Reusable/HeroBanner/AdminBanner';
import AlertPopup from '../../01-Reusable/PopUp/AlertPopup';
import './AddPeriod.css';

const AddPeriod = () => {
  const history = useHistory();
  const [period, setPeriod] = useState({});
  const [seasons, setSeasons] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const handleVisibility = () => {
    let _errors = {};
    let end = new Date(document.getElementById('edit-period-enddate').value);
    let start = new Date(
      document.getElementById('edit-period-startdate').value
    );
    let name = document.getElementById('edit-period-name').value;
    let _season = document.getElementById('select-period').value;

    seasons.forEach((season) => {
      if (season.seasonName === _season) {
        _season = season;
      }
    });

    if (name.length === 0) {
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

    let _period = {
      end: end,
      start: start,
      name: name,
      season: _season,
    };

    setPeriod(_period);

    setErrors({});
    setPopupVisible(!popupVisible);
  };

  const cookies = new Cookies();

  const addPeriod = async () => {
    try {
      const response = await fetch('/api/period/post', {
        method: 'POST',
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

  useEffect(() => {
    async function fetchSeasons() {
      fetch('/api/season/all')
        .then((response) => response.json())
        .then((data) => {
          setSeasons(data);
        })
        .catch((error) => console.log(error));
    }

    fetchSeasons();
  }, []);

  return (
    <>
      <BackButton
        name="Tilbake til endre søknads perioder"
        link="admin/endreperioder"
      />
      <AdminBanner name="Legg til periode" />
      <div className="add-period-container">
        <div className="edit-input-wrapper">
          <label className="edit-period-title" htmlFor="edit-period-name">
            Navn*
          </label>
          <input
            type="text"
            id="edit-period-name"
            className="edit-period-input"
            placeholder="Skriv inn navn..."
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
                seasons.map((season, index) => {
                  return (
                    <option value={season.seasonName} key={index}>
                      {season.seasonName}
                    </option>
                  );
                })}
            </select>
          </label>
        </div>
        <button onClick={handleVisibility} className="btn big">
          Lagre
        </button>
      </div>
      {popupVisible && (
        <AlertPopup
          positiveAction="Ja"
          negativeAction="Nei"
          title={'Lagring av periode'}
          description={'Er du sikker på at du vil lagre perioden?'}
          acceptMethod={addPeriod}
          cancelMethod={handleVisibility}
        />
      )}
    </>
  );
};

export default AddPeriod;
