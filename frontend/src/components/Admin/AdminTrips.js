import { useEffect, useState } from 'react';
import BackButton from '../01-Reusable/Buttons/BackButton';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import './AdminTrips.css';

const AdminTrips = () => {
  let noTrips = [];
  const [trips, setTrips] = useState(noTrips);
  const [futureTrips, setFutureTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);
  const [name, setName] = useState('');
  let cabins = '';

  const getFutureTrips = async () => {
    const response = await fetch('/application/winners/future');
    const data = await response.json();
    if (response.ok) {
      setFutureTrips(data);
    } else {
      setFutureTrips(noTrips);
    }
  };

  const getPastTrips = async () => {
    const response = await fetch('/application/winners/past');
    const data = await response.json();
    if (response.ok) {
      setPastTrips(data);
    } else {
      setPastTrips(noTrips);
    }
  };

  const showFutureTrips = () => {
    setName('fremtidige');
    setTrips(futureTrips);
  };

  const showPastTrips = () => {
    setName('tidligere');
    setTrips(pastTrips);
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

  useEffect(() => {
    getFutureTrips();
    getPastTrips();
  }, []);

  return (
    <>
      <BackButton name="Tilbake til admin" link="admin" />
      <HeroBanner name="Alle turer" />
      <div className="admin-trips-container">
        <button onClick={showPastTrips} className="btn big">
          Se tidligere turer
        </button>
        <button onClick={showFutureTrips} className="btn big">
          Se fremtidige turer
        </button>
        {trips.length > 0 && <p className="admin-trips-title">{name} turer:</p>}

        {trips ? (
          trips?.map((trip, index) => {
            cabins = '';
            return (
              <div className="application" key={index}>
                <h2>Tur ID #{trip.applicationId}</h2>
                <div className="application-wrapper">
                  <div className="application-half">
                    <div>
                      <h4>Accenture ID:</h4>
                      <p>{trip.accentureId}</p>
                      <h4>Bruker:</h4>
                      <p>{trip.userId}</p>
                      <h4>Tilfeldig / Spesifikk hytte:</h4>
                      <p>
                        {trip.cabinAssignment === 'random'
                          ? 'Tilfeldig'
                          : 'Spesifikk'}
                      </p>
                      <h4>Valgte hytter:</h4>
                      <div className="application-cabins-wrapper">
                        {trip.cabins.forEach((cabin) => {
                          cabins += cabin.cabinName += ' ';
                        })}
                        <p>{cabins}</p>
                      </div>
                      <h4>Antall hytter ønsket:</h4>
                      <p>{trip.numberOfCabins}</p>
                    </div>
                  </div>
                  <div className="application-half">
                    <div>
                      <h4>Periode informasjon:</h4>
                      <p>ID: {trip.period.id}</p>
                      <p>Navn: {trip.period.name}</p>
                      <p>Sesong: {trip.period.season.seasonName}</p>
                      <p>Startdato: {getFormattedDate(trip.period.start)}</p>
                      <p>Sluttdato: {getFormattedDate(trip.period.end)}</p>
                      <h4>Type tur:</h4>
                      <p>
                        {trip.tripPurpose === 'private' ? 'Privat' : 'Prosjekt'}
                      </p>
                      <h4>Vinner:</h4>
                      <p> {!trip.winner ? 'Nei' : 'Ja'}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="trip-info-text">
            Ingen {name.length > 0 ? name : ''} turer!
          </p>
        )}
      </div>
    </>
  );
};

export default AdminTrips;
