import { useState } from 'react';
import './MineTurer.css';
import { CgProfile } from 'react-icons/cg';
import NeedsAttentionTrips from './TypeTrips/NeedsAttentionTrips';
import YourApplications from './TypeTrips/YourApplications';
import YourTrips from './TypeTrips/YourTrips';

const MineTurer = () => {
  const [chosenTripType, setChosenTripType] = useState('Krever handling');

  const nullstilButtons = () => {
    const btns = document.getElementsByClassName('mytrip-types-btn');
    for (let button in btns) {
      try {
        btns[button].classList.remove('mytrip-active');
      } catch (error) {
        //isnt there, do nothing
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
