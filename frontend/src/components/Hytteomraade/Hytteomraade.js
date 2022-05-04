import { ReactComponent as HemsedalLogo } from './hemsedal-logo.svg';
import { FaSkiing, FaDog, FaSpa } from 'react-icons/fa';
import { MdSledding } from 'react-icons/md';
import { GiMountainClimbing, GiHorseshoe, GiFishingPole } from 'react-icons/gi';
import { IoIosBicycle } from 'react-icons/io';
import { BiWalk } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import './Hytteomraade.css';

const Hytteomraade = () => {
  return (
    <>
      <div className="omraade-hero">
        <img
          className="omraade-picture omraade-summer"
          src={`${process.env.PUBLIC_URL}/assets/pictures/hemsedal-sommer.jpg`}
          alt={'Hemsedal sommer forest'}
        />
        <img
          className="omraade-picture omraade-winter"
          src={`${process.env.PUBLIC_URL}/assets/pictures/hemsedal-winter.jpg`}
          alt={'Hemsedal winter forest'}
        />
        <HemsedalLogo className="omraade-logo" />
      </div>

      <div className="season omraade-winter">
        <div className="season-icons">
          <div className="icon-row">
            <FaSkiing
              className="season-icon icon-winter"
              aria-label="Down hill skiing icon"
            />
            <p>20 Heiser og 53 bakker</p>
          </div>
          <div className="icon-row">
            <MdSledding
              className="season-icon icon-winter"
              aria-label="Sledding icon"
            />
            <p>Aking i Fjellheis</p>
          </div>
          <div className="icon-row">
            <GiHorseshoe
              className="season-icon icon-winter"
              aria-label="Horse riding icon"
            />
            <p>Ridning - Haugen Gård</p>
          </div>
          <div className="icon-row">
            <FaDog className="season-icon icon-winter" aria-label="Dog icon" />
            <p>Hundekjøring</p>
          </div>
          <div className="icon-row">
            <FaSpa className="season-icon icon-winter" aria-label="Spa icon" />
            <p>Spa og Welness</p>
          </div>
          <div className="icon-row">
            <GiMountainClimbing
              className="season-icon icon-winter"
              aria-label="Mountain icon"
            />
            <p>Is- og innendørsklatring</p>
          </div>
        </div>
        <img
          className="season-picture omraade-winter"
          src={`${process.env.PUBLIC_URL}/assets/pictures/hemsedal-ski-winter.jpg`}
          alt={'Hemsedal winter skislope'}
        />
      </div>

      <div className="season omraade-summer">
        <img
          className="season-picture omraade-summer"
          src={`${process.env.PUBLIC_URL}/assets/pictures/hemsedal-hike-sommer.jpg`}
          alt={'Hemsedal sommer mountain hike'}
        />
        <div className="season-icons">
          <div className="icon-row">
            <BiWalk
              className="season-icon icon-summer"
              aria-label="Hiking icon"
            />
            <p>Fantastiske fjellturer</p>
          </div>
          <div className="icon-row">
            <IoIosBicycle
              className="season-icon icon-summer"
              aria-label="Bicycle icon"
            />
            <p>Norges råeste flytstier</p>
          </div>
          <div className="icon-row">
            <GiHorseshoe
              className="season-icon icon-summer"
              aria-label="Horse icon"
            />
            <p>Ridning - Haugen Gård</p>
          </div>
          <div className="icon-row">
            <GiFishingPole
              className="season-icon icon-summer"
              aria-label="Fishing icon"
            />
            <p>Prøv fiskelykken</p>
          </div>
          <div className="icon-row">
            <FaSpa className="season-icon icon-summer" aria-label="Spa icon" />
            <p>Spa og Welness</p>
          </div>
          <div className="icon-row">
            <GiMountainClimbing
              className="season-icon icon-summer"
              aria-label="Mountain icon"
            />
            <p>Via ferrata </p>
          </div>
        </div>
      </div>

      <Link
        className=" btn big omraade-btn btn-link"
        to={{ pathname: 'https://hemsedal.com/' }}
        target="_blank"
      >
        Finn flere aktiviteter
      </Link>
    </>
  );
};

export default Hytteomraade;
