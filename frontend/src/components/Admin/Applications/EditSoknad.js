import { useEffect, useState } from 'react';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import HeroBanner from '../../01-Reusable/HeroBanner/HeroBanner';
import AlertPopup from '../../01-Reusable/PopUp/AlertPopup';
import './EditSoknad.css';

const Application = () => {
  const link = window.location.href;
  const tripID = link.split('/')[5];
  let selectedCabins = [];

  const [trip, setTrip] = useState({});
  const [cabins, setCabins] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [updated, setUpdated] = useState(false);

  const handleVisibility = () => {
    setUpdated(!updated);
  };

  function getFormattedDate(inDate) {
    let date = new Date(inDate);
    let year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    if (month.length < 2) {
      month = '0' + month;
    }
    let day = date.getDate().toString();
    if (day.length < 2) {
      day = '0' + day;
    }
    return day + '/' + month + '/' + year;
  }

  const getTrip = async () => {
    const response = await fetch('/application/' + tripID);
    const data = await response.json();
    if (response.ok) {
      setTrip(data);
    }
  };

  const getUsers = () => {
    fetch('/user/all')
      .then((response) => response.json())
      .then((data) => setUsers(data));
  };

  const getUser = () => {
    fetch('/user/' + localStorage.getItem('tripUser'))
      .then((response) => response.json())
      .then((data) => setUser(data));
  };

  const getCabinNames = async () => {
    const response = await fetch('/cabin/active/names');
    const data = await response.json();
    if (response.ok) {
      setCabins(data);
    }
  };

  const getPeriods = async () => {
    const response = await fetch('/period/all');
    const data = await response.json();
    if (response.ok) {
      setPeriods(data);
    }
  };

  const editApplication = async () => {
    let _cabins = [];
    const utsikten = document.getElementById('Utsikten');
    const knausen = document.getElementById('Knausen');
    const fanitullen = document.getElementById('Fanitullen');
    const storeG = document.getElementById('Store Grøndalen');
    const winner = document.getElementById('edit-winner').checked;

    if (utsikten.checked) {
      _cabins.push({ cabinName: utsikten.value });
    }

    if (knausen.checked) {
      _cabins.push({ cabinName: knausen.value });
    }

    if (fanitullen.checked) {
      _cabins.push({ cabinName: fanitullen.value });
    }

    if (storeG.checked) {
      _cabins.push({ cabinName: storeG.value });
    }

    const _application = trip;
    _application.cabinsWon = _cabins;
    _application.winner = winner;

    const response = await fetch('/application/setwinner', {
      method: 'PATCH',
      headers: { token: localStorage.getItem('refresh_token') },
      body: JSON.stringify(_application),
    });

    const data = await response.json();
    if (response.ok) {
      setUpdated(false);
    }
  };

  useEffect(() => {
    getCabinNames();
    getPeriods();
    getTrip();
    getUsers();
    getUser();
  }, []);

  return (
    <>
      <BackButton
        name="Tilbake til endre søknader"
        link="admin/endresoknader"
      />
      <HeroBanner name="Endre søknad" />
      <div className="edit-trip-container">
        <div className="edit-trip-grid">
          <div>
            <div className="edit-trip-wrapper">
              <label className="edit-trip-label" htmlFor="edit-accentureid">
                Accenture ID
              </label>
              <p className="edit-trip-info">{trip.accentureId}</p>
            </div>
            <div className="edit-trip-wrapper">
              <p className="edit-trip-title">Bruker:</p>
              {users?.map((_user, index) => {
                if (_user.userId === user.userId) {
                  return (
                    <p key={index} className="edit-trip-info">
                      {_user.firstname +
                        ' ' +
                        _user.lastname +
                        ' - ' +
                        _user.email}
                    </p>
                  );
                }
              })}
            </div>

            <div className="edit-trip-wrapper">
              <p className="edit-trip-title">Type tur</p>
              <p className="edit-trip-info">{trip.tripPurpose}</p>
            </div>
          </div>
          <div>
            <div className="edit-trip-wrapper">
              <p className="edit-trip-title">Periode</p>
              {trip.length !== 0 &&
              periods.length !== 0 &&
              typeof trip.period !== 'undefined'
                ? periods?.map((period, index) => {
                    if (period.id === trip.period.id) {
                      return (
                        <p className="edit-trip-info" key={index}>
                          {getFormattedDate(period.start) +
                            ' - ' +
                            getFormattedDate(period.end) +
                            ' (' +
                            period.name +
                            ')'}
                        </p>
                      );
                    }
                  })
                : null}
            </div>
            <div className="edit-trip-wrapper">
              <p className="edit-trip-title">Hyttevalg</p>
              <p className="edit-trip-info">{trip.cabinAssignment}</p>
            </div>
            <div className="edit-trip-wrapper">
              <label className="edit-trip-label" htmlFor="edit-numberofcabins">
                Antall ønskede hytter
              </label>
              <p className="edit-trip-info">{trip.numberOfCabins}</p>
            </div>
          </div>
        </div>

        <div className="edit-trip-wrapper2">
          <p className="edit-trip-title">Valgte hytter</p>
          {cabins?.map((cabin, i) => {
            trip.cabins?.forEach((chosenCabin) => {
              if (cabin === chosenCabin.cabinName) {
                selectedCabins.push(cabin);
              }
            });
            if (selectedCabins.includes(cabin)) {
              return (
                <div className="edit-trip-cabins" key={i}>
                  <input
                    defaultChecked={true}
                    name={cabin}
                    type="checkbox"
                    className="edit-trip-input-checkbox2"
                    id={cabin}
                    value={cabin}
                  />
                  <label className="edit-trip-cabinslabel">{cabin}</label>
                </div>
              );
            } else {
              return (
                <div className="edit-trip-cabins" key={i}>
                  <input
                    name={cabin}
                    className="edit-trip-input-checkbox2"
                    type="checkbox"
                    id={cabin}
                    value={cabin}
                  />
                  <label className="edit-trip-cabinslabel">{cabin}</label>
                </div>
              );
            }
          })}
        </div>
        {trip.winner ? (
          <div className="edit-trip-wrapper2">
            <p className="edit-trip-title">Hytte(r) vunnet:</p>
            {trip.cabinsWon.map((cabin, i) => {
              return (
                <div key={i}>
                  <p className="edit-trip-info">{cabin.cabinName}</p>
                </div>
              );
            })}
          </div>
        ) : null}
        <div className="edit-trip-cbwrapper">
          <label className="edit-trip-label" htmlFor="edit-winner">
            Vinner
          </label>
          <input
            className="edit-trip-input-checkbox"
            defaultChecked={trip.winner}
            type="checkbox"
            id="edit-winner"
          />
        </div>
        <button onClick={handleVisibility} className="btn big">
          Endre
        </button>
      </div>
      {updated && (
        <AlertPopup
          title="Endring av søknad"
          description="Er du sikker på at du vil endre søknaden?"
          negativeAction="Nei"
          positiveAction="Ja"
          cancelMethod={handleVisibility}
          acceptMethod={editApplication}
        />
      )}
    </>
  );
};

export default Application;
