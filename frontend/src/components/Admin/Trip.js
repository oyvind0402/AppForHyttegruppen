import { useEffect, useState } from 'react';
import BackButton from '../01-Reusable/Buttons/BackButton';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import './Trip.css';

const Trip = () => {
  const link = window.location.href;
  const tripID = link.split('/')[4];
  let selectedCabins = [];

  const [trip, setTrip] = useState({});
  const [cabins, setCabins] = useState([]);
  const [user, setUser] = useState({});

  const [checked, setChecked] = useState(true);
  const [random, setRandom] = useState(true);

  const handleChange = () => {
    setChecked((checked) => !checked);
  };

  const handleRandom = () => {
    setRandom((random) => !random);
  };

  const getTrip = async () => {
    const response = await fetch('/application/' + tripID);
    const data = await response.json();
    if (response.ok) {
      setTrip(data);
    }
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

  useEffect(() => {
    getCabinNames();
    getTrip();
    getUser();
    console.log(trip);
  }, []);

  return (
    <>
      <BackButton name="Tilbake til turhistorikk" link="historikk" />
      <HeroBanner name="Endre tur" />
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
          {Object.entries(user)?.map(([key, value, i]) => {
            if (key !== 'password') {
              return (
                <p className="trip-user-text" key={i}>
                  {key + ': ' + value}
                </p>
              );
            }
          })}
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
          <label className="edit-trip-label2" htmlFor="edit-randomassignment">
            Tilfeldig
          </label>
          <input
            className="edit-trip-input-radio"
            checked={trip.cabinAssignment === 'random' ? random : !random}
            onChange={handleRandom}
            type="radio"
            id="edit-randomassignment"
          />
          <label className="edit-trip-label2" htmlFor="edit-specificassignment">
            Spesifikk
          </label>
          <input
            className="edit-trip-input-radio"
            checked={trip.cabinAssignment === 'specific' ? random : !random}
            onChange={handleRandom}
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
            checked={trip.tripPurpose === 'private' ? checked : !checked}
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

export default Trip;
