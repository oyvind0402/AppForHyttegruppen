import { useEffect, useState } from 'react';
import TripCardActionReq from '../01-Reusable/TripCard/TripCardActionReq';
import TripCardActive from '../01-Reusable/TripCard/TripCardActive';
import TripCardPast from '../01-Reusable/TripCard/TripCardPast';
import TripCardPending from '../01-Reusable/TripCard/TripCardPending';
import './MineTurer.css';
import { CgProfile } from 'react-icons/cg';
import NeedsAttentionTrips from './TypeTrips/NeedsAttentionTrips';
import YourApplications from './TypeTrips/YourApplications';
import YourTrips from './TypeTrips/YourTrips';

const MineTurer = () => {
  const [chosenTripType, setChosenTripType] = useState('Krever handling');
  //let chosenTripType = 'Dine turer';
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

  const nullstilButtons = () => {
    const btns = document.getElementsByClassName('mytrip-types-btn');
    for (let button in btns) {
      try {
        btns[button].classList.remove('mytrip-active');
      } catch (error) {
        //isnt there
      }
    }
  };

  return (
    <>
      <div className="mytrip-banner">
        <h2 className="mytrip-banner-title">Mine turer</h2>

        <img
          className="hero-picture mytrip-picture-banner"
          src={`${process.env.PUBLIC_URL}/assets/pictures/herobanner.jpg`}
          alt="mine turer"
        />
        <CgProfile className="mytrip-profile-icon" />
        <div className="mytrip-types">
          <div className="mytrip-type">
            <button
              className="mytrip-types-btn mytrip-active"
              onClick={(event) => {
                setChosenTripType('Krever handling');
                nullstilButtons();
                event.target.classList.add('mytrip-active');
              }}
            >
              Krever handling
            </button>
          </div>
          <div className="mytrip-type">
            <button
              className="mytrip-types-btn"
              onClick={(event) => {
                setChosenTripType('Dine søknader');
                nullstilButtons();
                event.target.classList.add('mytrip-active');
              }}
            >
              Dine søknader
            </button>
          </div>
          <div className="mytrip-type">
            <button
              className="mytrip-types-btn"
              onClick={(event) => {
                setChosenTripType('Dine turer');
                nullstilButtons();
                event.target.classList.add('mytrip-active');
              }}
            >
              Dine turer
            </button>
          </div>
        </div>
      </div>

      <div className="mytrip-container">
        {chosenTripType === 'Krever handling' && <NeedsAttentionTrips />}
        {chosenTripType === 'Dine søknader' && <YourApplications />}
        {chosenTripType === 'Dine turer' && <YourTrips />}
      </div>
    </>
  );
};

export default MineTurer;
