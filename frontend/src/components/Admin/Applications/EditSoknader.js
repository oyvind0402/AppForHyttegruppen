import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import HeroBanner from '../../01-Reusable/HeroBanner/HeroBanner';
import './EditSoknader.css';

const Applications = () => {
  const [trips, setTrips] = useState([]);
  const [tripsCopy, setTripsCopy] = useState([]);
  let cabins = '';

  const fetchApplications = async () => {
    const response = await fetch('/application/all', {
      response: 'GET',
    });

    const data = await response.json();
    if (response.ok) {
      setTrips(data);
      setTripsCopy(data);
    }
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

  const setUserToTrip = (userId) => {
    localStorage.setItem('tripUser', userId);
  };

  const handleDelete = async (id) => {
    const response = await fetch('/application/delete', {
      method: 'DELETE',
      body: JSON.stringify(id),
      headers: { token: localStorage.getItem('token') },
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data);
    }
  };

  const changeTrips = (type) => {
    let date = new Date();
    if (type === 'all') {
      setTrips(tripsCopy);
    } else if (type === 'future') {
      const newTrips = tripsCopy.filter((trip) => {
        let tripDate = new Date(trip.period.start);
        if (trip.winner && tripDate.getDate() > date.getDate()) {
          return trip;
        }
      });
      setTrips(newTrips);
    } else if (type === 'past') {
      const newTrips = tripsCopy.filter((trip) => {
        let tripDate = new Date(trip.period.start);
        if (trip.winner && tripDate.getDate() < date.getDate()) {
          return trip;
        }
      });
      setTrips(newTrips);
    } else if (type === 'current') {
      const newTrips = tripsCopy.filter((trip) => {
        let tripDate = new Date(trip.period.start);
        let tripEnd = new Date(trip.period.end);
        if (
          trip.winner &&
          tripDate.getDate() <= date.getDate() &&
          tripEnd.getDate() >= date.getDate()
        ) {
          return trip;
        }
      });
      setTrips(newTrips);
    } else if (type === 'pending') {
      const newTrips = tripsCopy.filter((trip) => {
        let tripDate = new Date(trip.period.start);
        console.log(tripDate);
        console.log(date);
        if (!trip.winner && tripDate.getTime() > date.getTime()) {
          return trip;
        }
      });
      setTrips(newTrips);
    } else {
      const newTrips = tripsCopy.filter((trip) => {
        let tripDate = new Date(trip.period.start);
        console.log(tripDate.getDate());
        console.log(date.getDate());
        if (!trip.winner && tripDate.getTime() < date.getTime()) {
          return trip;
        }
      });
      setTrips(newTrips);
    }
  };

  useEffect(() => {
    localStorage.removeItem('tripUser');
    fetchApplications();
  }, []);

  return (
    <>
      <BackButton name="Tilbake til endre sideinnhold" link="admin/endringer" />
      <HeroBanner name="Alle søknader" />
      <p className="application-title">
        Søknader/turer ({trips.length !== 0 ? trips.length : 0})
      </p>
      <div className="trips-filter-container">
        <select
          id="selected-trips"
          onChange={(e) => changeTrips(e.target.value)}
          className="trips-filter"
        >
          <option value="all">Alle turer/søknader</option>
          <option value="future">Fremtidige turer</option>
          <option value="past">Tidligere turer</option>
          <option value="current">Nåværende turer</option>
          <option value="pending">Fremtidige søknader</option>
          <option value="declined">Tidligere avslåtte søknader</option>
        </select>
      </div>

      <div className="application-container">
        {trips?.map((item, index) => {
          cabins = '';
          return (
            <div className="application" key={index}>
              <h2>
                {!item.winner ? 'Søknad' : 'Tur'} ID #{item.applicationId}
              </h2>
              <div className="application-wrapper">
                <div className="application-half">
                  <div>
                    <h4>Accenture ID:</h4>
                    <p>{item.accentureId}</p>
                    <h4>Bruker:</h4>
                    <p>{item.userId}</p>
                    <h4>Tilfeldig / Spesifikk hytte:</h4>
                    <p>
                      {item.cabinAssignment === 'random'
                        ? 'Tilfeldig'
                        : 'Spesifikk'}
                    </p>
                    <h4>Valgte hytter:</h4>
                    <div className="application-cabins-wrapper">
                      {item.cabins.forEach((cabin) => {
                        cabins += cabin.cabinName += ' ';
                      })}
                      <p>{cabins}</p>
                    </div>
                    <h4>Antall hytter ønsket:</h4>
                    <p>{item.numberOfCabins}</p>
                  </div>
                </div>
                <div className="application-half">
                  <div>
                    <h4>Periode informasjon:</h4>
                    <p>ID: {item.period.id}</p>
                    <p>Navn: {item.period.name}</p>
                    <p>Sesong: {item.period.season.seasonName}</p>
                    <p>Startdato: {getFormattedDate(item.period.start)}</p>
                    <p>Sluttdato: {getFormattedDate(item.period.end)}</p>
                    <h4>Type tur:</h4>
                    <p>
                      {item.tripPurpose === 'private' ? 'Privat' : 'Prosjekt'}
                    </p>
                    <h4>Vinner:</h4>
                    <p> {!item.winner ? 'Nei' : 'Ja'}</p>
                  </div>
                </div>
              </div>
              <div className="button-container">
                <Link
                  to={'/admin/endresoknad/' + item.applicationId}
                  className="link btn-smaller"
                  onClick={() => setUserToTrip(item.userId)}
                >
                  {!item.winner ? 'Endre søknad' : 'Endre tur'}
                </Link>
                <span
                  className="btn-smaller"
                  onClick={() => handleDelete(item.applicationId)}
                >
                  {!item.winner ? 'Slett søknad' : 'Avbestill tur'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Applications;
