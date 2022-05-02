import { useEffect, useState } from 'react';
import TripCardActionReq from '../../01-Reusable/TripCard/TripCardActionReq';
import './../MineTurer.css';

const NeedsAttentionTrips = () => {
  const [currentTrips, setCurrentTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);
  let anyFeedback = false;

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

    const response2 = await fetch(
      '/application/byuser/' + localStorage.getItem('userID') + '/past'
    );
    const data2 = await response2.json();
    if (response2.ok) {
      setPastTrips(data2);
    }
  };

  useEffect(() => {
    getApplications();
  }, []);

  return (
    <>
      {currentTrips !== null ? (
        <div className={'mytrip-card-wrapper'}>
          <p className="mytrip-title-empty">Krever handling:</p>

          <div className="trip-row-wrapper">
            {currentTrips.map((trip, index) => {
              if (!trip.feedback) {
                anyFeedback = true;
                return <TripCardActionReq key={index} data={trip} />;
              }
            })}
          </div>
          <div className="trip-row-wrapper">
            {pastTrips.map((trip, index) => {
              if (!trip.feedback) {
                anyFeedback = true;
                return <TripCardActionReq key={index} data={trip} />;
              }
            })}
          </div>
        </div>
      ) : (
        <>
          <div className={'mytrip-card-wrapper'}>
            <p className="mytrip-title-empty">Krever handling:</p>
            <p className="empty-trip">Ingen turer trenger oppmerksomhet</p>
          </div>
        </>
      )}
    </>
  );
};

export default NeedsAttentionTrips;
