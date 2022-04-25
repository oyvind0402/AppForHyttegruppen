import { useEffect, useState } from 'react';
import TripCardActionReq from '../../01-Reusable/TripCard/TripCardActionReq';
import TripCardPending from '../../01-Reusable/TripCard/TripCardPending';
import './../MineTurer.css';

const NeedsAttentionTrips = () => {
  const [pendingTrips, setPendingTrips] = useState([]);

  const getApplications = async () => {
    const response = await fetch(
      '/application/byuser/' + localStorage.getItem('userID') + '/current',
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
          <p className="mytrip-title-empty">Krever handling:</p>

          <div className="trip-row-wrapper">
            {pendingTrips.map((trip, index) => (
              <TripCardActionReq key={index} data={trip} />
            ))}
          </div>
        </div>
      ) : (
        <p className="empty-trip">Ingen turer trenger oppmerksomhet</p>
      )}
    </>
  );
};

export default NeedsAttentionTrips;
