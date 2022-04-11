import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../01-Reusable/Buttons/BackButton';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import './EditSoknader.css';

const Applications = () => {
  const [trips, setTrips] = useState([]);
  let cabins = '';

  const fetchApplications = async () => {
    const response = await fetch('/application/all', {
      response: 'GET',
    });

    const data = await response.json();
    if (response.ok) {
      setTrips(data);
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
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data);
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
        Alle søknader ({trips.length !== 0 ? trips.length : 0})
      </p>
      <div className="application-container">
        {trips?.map((item, index) => {
          cabins = '';
          return (
            <div className="application" key={index}>
              <h2>Søknads ID #{item.applicationId}</h2>
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
                  Endre søknad
                </Link>
                <span
                  to={'/admin/endresoknad/' + item.applicationId}
                  className="btn-smaller"
                  onClick={() => handleDelete(item.applicationId)}
                >
                  Slett søknad
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
