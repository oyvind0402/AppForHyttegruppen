import { useContext } from 'react';
import LoginContext from '../../LoginContext/login-context';
import { ReactComponent as HemsedalLogo } from './hemsedal-logo.svg';
import BigButtonLink from '../01-Reusable/Buttons/BigButtonLink';
import { FaSkiing, FaHorse, FaDog, FaSpa, FaWalking } from 'react-icons/fa';
import { MdSledding } from 'react-icons/md';
import { GiMountainClimbing, GiHorseshoe, GiFishingPole } from 'react-icons/gi';
import { IoIosBicycle } from 'react-icons/io';
import { BiWalk } from 'react-icons/bi';
import { Link } from 'react-router-dom';

import './Hytteomraade.css';

const Hytteomraade = () => {
  const loginContext = useContext(LoginContext);

  const loggedIn = loginContext.loggedIn;

  return (
    <>
      <div className="omraade-hero">
        <img
          className="omraade-picture omraade-summer"
          src={`${process.env.PUBLIC_URL}/assets/pictures/hemsedal-sommer.jpg`}
          alt={'Hemsedal Sommer'}
        />
        <img
          className="omraade-picture omraade-winter"
          src={`${process.env.PUBLIC_URL}/assets/pictures/hemsedal-winter.jpg`}
          alt={'Hemsedal winter'}
        />
        <HemsedalLogo className="omraade-logo" />
      </div>

      <div className="season omraade-winter">
        <div className="season-icons">
          <div className="icon-row">
            <FaSkiing className="season-icon icon-winter" />
            <p>20 Heiser og 53 bakker</p>
          </div>
          <div className="icon-row">
            <MdSledding className="season-icon icon-winter" />
            <p>Aking i Fjellheis</p>
          </div>
          <div className="icon-row">
            <GiHorseshoe className="season-icon icon-winter" />
            <p>Ridning - Haugen Gård</p>
          </div>
          <div className="icon-row">
            <FaDog className="season-icon icon-winter" />
            <p>Hundekjøring</p>
          </div>
          <div className="icon-row">
            <FaSpa className="season-icon icon-winter" />
            <p>Spa og Welness</p>
          </div>
          <div className="icon-row">
            <GiMountainClimbing className="season-icon icon-winter" />
            <p>Is- og innendørsklatring</p>
          </div>
        </div>
        <img
          className="season-picture omraade-winter"
          src={`${process.env.PUBLIC_URL}/assets/pictures/hemsedal-ski-winter.jpg`}
          alt={'Hemsedal winter'}
        />
      </div>

      <div className="season omraade-summer">
        <img
          className="season-picture omraade-summer"
          src={`${process.env.PUBLIC_URL}/assets/pictures/hemsedal-hike-sommer.jpg`}
          alt={'Hemsedal winter'}
        />
        <div className="season-icons">
          <div className="icon-row">
            <BiWalk className="season-icon icon-summer" />
            <p>Fantastiske fjellturer</p>
          </div>
          <div className="icon-row">
            <IoIosBicycle className="season-icon icon-summer" />
            <p>Norges råeste flytstier</p>
          </div>
          <div className="icon-row">
            <GiHorseshoe className="season-icon icon-summer" />
            <p>Ridning - Haugen Gård</p>
          </div>
          <div className="icon-row">
            <GiFishingPole className="season-icon icon-summer" />
            <p>Prøv fiskelykken</p>
          </div>
          <div className="icon-row">
            <FaSpa className="season-icon icon-summer" />
            <p>Spa og Welness</p>
          </div>
          <div className="icon-row">
            <GiMountainClimbing className="season-icon icon-summer" />
            <p>Via ferrata </p>
          </div>
        </div>
      </div>

      <button className="btn big omraade-btn">
        <Link
          className="btn-link"
          to={{ pathname: 'https://hemsedal.com/' }}
          target="_blank"
        >
          Finn flere aktiviteter
        </Link>
      </button>
    </>
  );
};

export default Hytteomraade;
