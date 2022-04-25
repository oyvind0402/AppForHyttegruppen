import { useEffect, useState } from 'react';
import TripCardActionReq from '../../01-Reusable/TripCard/TripCardActionReq';
import './../MineTurer.css';

const NeedsAttentionTrips = () => {
  const [currentTrips, setCurrentTrips] = useState([]);

  const getApplications = async () => {
    const response = await fetch(
      '/application/byuser/' + localStorage.getItem('userID') + '/current',
      {
        method: 'GET',
      }
    );
    const data = await response.json();
    if (response.ok) {
      setCurrentTrips(data);
    }
  };

  useEffect(() => {
    getApplications();
  }, []);

  return (
    <>
      {currentTrips !== null ? (
        <div className="mytrip-card-wrapper">
          <p className="mytrip-title-empty">Krever handling:</p>

          <div className="trip-row-wrapper">
            {currentTrips.map((trip, index) => (
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
