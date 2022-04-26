import { useEffect, useState } from 'react';
import TripCardPending from '../../01-Reusable/TripCard/TripCardPending';

import './../MineTurer.css';

const YourApplications = () => {
  const [pendingTrips, setPendingTrips] = useState([]);

  const getApplications = async () => {
    const response = await fetch(
      '/application/byuser/' + localStorage.getItem('userID') + '/pending',
      {
        method: 'GET',
      }
    );
    const data = await response.json();
    if (response.ok) {
      setPendingTrips(data);
    }
  };

  useEffect(() => {
    getApplications();
  }, []);

  return (
    <>
      {pendingTrips !== null ? (
        <div className="mytrip-card-wrapper">
          <p className="mytrip-title-empty">Dine søknader:</p>
          <div className="trip-row-wrapper">
            {pendingTrips.map((trip, index) => (
              <TripCardPending key={index} data={trip} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mytrip-card-wrapper">
          <p className="mytrip-title-empty">Dine søknader:</p>
          <p className="empty-trip">Ingen søkander funnet</p>
        </div>
      )}
    </>
  );
};

export default YourApplications;
