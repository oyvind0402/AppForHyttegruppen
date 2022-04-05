import { useEffect, useState } from 'react';
import BackButton from '../01-Reusable/Buttons/BackButton';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import './EditSoknad.css';

const Application = () => {
  const link = window.location.href;
  const tripID = link.split('/')[4];
  let selectedCabins = [];

  const [trip, setTrip] = useState({});
  const [cabins, setCabins] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});

  const [checked, setChecked] = useState(true);
  const [purpose, setPurpose] = useState(true);

  const handleChange = () => {
    setChecked((checked) => !checked);
  };

  const handlePurpose = () => {
    setPurpose((purpose) => !purpose);
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

  useEffect(() => {
    getCabinNames();
    getTrip();

    getUsers();
    getUser();
    getPeriods();
    console.log(trip);
    console.log(periods);
    console.log(users);
  }, []);

  return (
    <>
      <BackButton name="Tilbake til turhistorikk" link="historikk" />
      <HeroBanner name="Endre søknad" />
      <div className="edit-trip-container">
        <div className="edit-trip-wrapper">
          <label className="edit-trip-label" htmlFor="edit-accentureid">
            Accenture ID
          </label>
          <input
            className="edit-trip-input"
            defaultValue={trip.accentureId}
            type="text"
            id="edit-accentureid"
          />
        </div>
        <div className="trip-user-wrapper">
          <p className="edit-trip-title">Bruker:</p>
          <select name="users" id="users">
            {users?.map((_user, index) => {
              if (_user.userId === user.userId) {
                return (
                  <option
                    key={index}
                    className="edit-trip-option"
                    selected
                    value={index}
                  >
                    {_user.firstname +
                      ' ' +
                      _user.lastname +
                      ' - ' +
                      _user.email}
                  </option>
                );
              } else {
                return (
                  <option className="edit-trip-option" value={index}>
                    {_user.firstname +
                      ' ' +
                      _user.lastname +
                      ' - ' +
                      _user.email}
                  </option>
                );
              }
            })}
          </select>
        </div>
        <div className="edit-trip-wrapper">
          <label className="edit-trip-label" htmlFor="edit-numberofcabins">
            Antall ønskede hytter
          </label>
          <input
            className="edit-trip-input"
            defaultValue={trip.numberOfCabins}
            type="number"
            id="edit-numberofcabins"
            min={1}
            max={cabins.length}
          />
        </div>
        <div>
          <p className="edit-trip-title">Hyttevalg</p>
          <label className="edit-trip-label2" htmlFor="edit-purposeassignment">
            Tilfeldig
          </label>
          <input
            className="edit-trip-input-radio"
            checked={trip.cabinAssignment === 'random' ? purpose : !purpose}
            onChange={handlePurpose}
            type="radio"
            id="edit-purposeassignment"
          />
          <label className="edit-trip-label2" htmlFor="edit-specificassignment">
            Spesifikk
          </label>
          <input
            className="edit-trip-input-radio"
            checked={trip.cabinAssignment === 'specific' ? purpose : !purpose}
            onChange={handlePurpose}
            type="radio"
            id="edit-specificassignment"
          />
        </div>
        <div className="edit-trip-wrapper2">
          <p className="edit-trip-title">Valgte hytter</p>

          {cabins?.map((cabin, i) => {
            trip.cabins?.map((chosenCabin) => {
              if (cabin === chosenCabin.cabinName) {
                selectedCabins.push(cabin);
              }
            });
            if (selectedCabins.includes(cabin)) {
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginBottom: '0.5rem',
                  }}
                >
                  <input
                    defaultChecked={true}
                    name={cabin}
                    type="checkbox"
                    className="edit-trip-input-checkbox2"
                    id={cabin}
                  />
                  <label style={{ lineHeight: '1.875rem', height: '1.875rem' }}>
                    {cabin}
                  </label>
                </div>
              );
            } else {
              return (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginBottom: '0.5rem',
                  }}
                  key={i}
                >
                  <input
                    name={cabin}
                    className="edit-trip-input-checkbox2"
                    type="checkbox"
                    id={cabin}
                  />
                  <label style={{ lineHeight: '1.875rem', height: '1.875rem' }}>
                    {cabin}
                  </label>
                </div>
              );
            }
          })}
        </div>
        <div>
          <p className="edit-trip-title">Type tur</p>
          <label className="edit-trip-label2" htmlFor="edit-privatetrip">
            Privat
          </label>
          <input
            className="edit-trip-input-radio"
            checked={
              trip.tripPurpose === 'privat' || trip.tripPurpose === 'private'
                ? checked
                : !checked
            }
            onChange={handleChange}
            type="radio"
            id="edit-privatetrip"
          />
          <label className="edit-trip-label2" htmlFor="edit-projecttrip">
            Prosjekt
          </label>
          <input
            className="edit-trip-input-radio"
            checked={trip.tripPurpose === 'project' ? checked : !checked}
            onChange={handleChange}
            type="radio"
            id="edit-projecttrip"
          />
        </div>
        <div className="edit-trip-wrapper">
          <p className="edit-trip-title">Periode</p>
          <select
            name="periods"
            id="periods"
            className="edit-trip-selectperiod"
          >
            {periods?.map((period, index) => {
              if (period.id === trip.period.id) {
                return (
                  <option selected key={index} value={period}>
                    {getFormattedDate(period.start) +
                      ' - ' +
                      getFormattedDate(period.end) +
                      ' (' +
                      period.name +
                      ')'}
                  </option>
                );
              } else {
                return (
                  <option key={index} value={period}>
                    {getFormattedDate(period.start) +
                      ' - ' +
                      getFormattedDate(period.end) +
                      ' (' +
                      period.name +
                      ')'}
                  </option>
                );
              }
            })}
          </select>
        </div>
        <div className="edit-trip-cbwrapper">
          <label className="edit-trip-label" htmlFor="edit-winner">
            Vinner
          </label>
          <input
            className="edit-trip-input-checkbox"
            defaultValue={trip.winner}
            type="checkbox"
            id="edit-winner"
          />
        </div>

        <button className="btn big">Endre</button>
      </div>
    </>
  );
};

export default Application;
