import { useEffect, useState } from 'react';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import TripCardActionReq from '../01-Reusable/TripCard/TripCardActionReq';
import TripCardActive from '../01-Reusable/TripCard/TripCardActive';
import TripCardPending from '../01-Reusable/TripCard/TripCardPending';
import './MineTurer.css';

const MineTurer = () => {
  const [pendingTrips, setPendingTrips] = useState([]);
  const [currentTrips, setCurrentTrips] = useState([]);
  const [futureTrips, setFutureTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);
  const [visibleTrips, setVisibleTrips] = useState(false);

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

    const response2 = await fetch(
      '/application/byuser/' + localStorage.getItem('userID') + '/past',
      {
        method: 'GET',
      }
    );
    const data2 = await response2.json();
    if (response2.ok) {
      setPastTrips(data2);
    }

    const response3 = await fetch(
      '/application/byuser/' + localStorage.getItem('userID') + '/current',
      {
        method: 'GET',
      }
    );
    const data3 = await response3.json();
    if (response3.ok) {
      setCurrentTrips(data3);
    }

    const response4 = await fetch(
      '/application/byuser/' + localStorage.getItem('userID') + '/future',
      {
        method: 'GET',
      }
    );
    const data4 = await response4.json();
    if (response4.ok) {
      setFutureTrips(data4);
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
      <HeroBanner name="Mine turer" />
      <div className="mytrip-container">
        {currentTrips !== null ? (
          <div className="mytrip-card-wrapper">
            <p className="mytrip-title">Krever handling:</p>
            <div className="trip-row-wrapper">
              {currentTrips.map((trip, index) => (
                <TripCardActionReq key={index} data={trip} />
              ))}
            </div>
          </div>
        ) : null}
        {currentTrips !== null ? <hr /> : null}
        {pendingTrips !== null ? (
          <div className="mytrip-card-wrapper">
            <p className="mytrip-title">Venter på godkjenning:</p>
            <div className="trip-row-wrapper">
              {pendingTrips.map((trip, index) => (
                <TripCardPending key={index} data={trip} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mytrip-card-wrapper">
            <p className="mytrip-title-empty">Venter på godkjenning:</p>
            <p className="empty-trip">Ingen turer venter på godkjenning</p>
          </div>
        )}

        <hr />
        {futureTrips !== null ? (
          <div className="mytrip-card-wrapper">
            <p className="mytrip-title-empty">Dine godkjente turer:</p>
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
                <TripCardActive key={index} data={trip} />
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
      </div>
    </>
  );
};

export default MineTurer;
