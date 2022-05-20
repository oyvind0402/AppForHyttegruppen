import { useEffect, useState } from 'react';
import TripCardActive from '../../01-Reusable/TripCard/TripCardActive';
import TripCardCurrent from '../../01-Reusable/TripCard/TripCardCurrent';

import TripCardPast from '../../01-Reusable/TripCard/TripCardPast';

import './../MineTurer.css';

const YourTrips = () => {
  const [futureTrips, setFutureTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);
  const [currentTrips, setCurrentTrips] = useState([]);
  const [visibleTrips, setVisibleTrips] = useState(false);

  const getApplications = async () => {
    try {
      const response2 = await fetch(
        '/api/application/byuser/' + localStorage.getItem('userID') + '/past',
        {
          method: 'GET',
        }
      );
      const data2 = await response2.json();
      if (response2.ok) {
        setPastTrips(data2);
      }

      const response4 = await fetch(
        '/api/application/byuser/' + localStorage.getItem('userID') + '/future',
        {
          method: 'GET',
        }
      );
      const data4 = await response4.json();
      if (response4.ok) {
        setFutureTrips(data4);
      }

      const response3 = await fetch(
        '/api/application/byuser/' + localStorage.getItem('userID') + '/current'
      );
      const data3 = await response3.json();
      if (response3.ok) {
        setCurrentTrips(data3);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getApplications();
  }, []);

  const seePastTrips = () => {
    setVisibleTrips(!visibleTrips);
  };
  return (
    <>
      {currentTrips !== null ? (
        <div className="mytrip-card-wrapper">
          <p className="mytrip-title-empty">Dine nåværende turer:</p>
          <div className="trip-row-wrapper">
            {currentTrips.map((trip, index) => (
              <TripCardCurrent key={index} data={trip} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mytrip-card-wrapper">
          <p className="mytrip-title-empty">Dine nåværende turer:</p>
          <p className="empty-trip">Ingen nåværende turer</p>
        </div>
      )}
      <hr />
      {futureTrips !== null ? (
        <div className="mytrip-card-wrapper">
          <p className="mytrip-title-empty">
            Dine godkjente (fremtidige) turer:
          </p>
          <div className="trip-row-wrapper">
            {futureTrips.map((trip, index) => (
              <TripCardActive key={index} data={trip} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mytrip-card-wrapper">
          <p className="mytrip-title-empty">Dine godkjente turer:</p>
          <p className="empty-trip">Ingen godkjente turer</p>
        </div>
      )}

      {visibleTrips ? <hr /> : null}

      {visibleTrips && pastTrips !== null ? (
        <div className="mytrip-card-wrapper">
          <p className="mytrip-title-empty">Dine tidligere turer:</p>
          <div className="trip-row-wrapper">
            {pastTrips.map((trip, index) => (
              <TripCardPast key={index} data={trip} />
            ))}
          </div>
        </div>
      ) : (
        <div className={visibleTrips ? 'mytrip-card-wrapper' : 'no-show'}>
          <p className="mytrip-title-empty">Dine tidligere turer:</p>
          <p className="empty-trip">Ingen tidligere turer</p>
        </div>
      )}

      <button className="btn big" onClick={seePastTrips}>
        {!visibleTrips ? 'Vis tidligere turer' : 'Skjul tidligere turer'}
      </button>
    </>
  );
};

export default YourTrips;
