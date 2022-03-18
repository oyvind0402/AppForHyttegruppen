import { useContext } from 'react';
import LoginContext from '../../LoginContext/login-context';
import BigButton from '../01-Reusable/Buttons/BigButton';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import TripCardActionReq from '../01-Reusable/TripCard/TripCardActionReq';
import TripCardActive from '../01-Reusable/TripCard/TripCardActive';
import TripCardPending from '../01-Reusable/TripCard/TripCardPending';
import './MineTurer.css';

const MineTurer = () => {
  const loginContext = useContext(LoginContext);

  const loggedIn = loginContext.loggedIn;

  const data = {
    applications: [
      {
        id: 1,
        cabinName: 'Utsikten',
        season: 'Uke 52',
        date: '27.12.2022',
        approved: 'approved',
        active: false,
        picture: `${process.env.PUBLIC_URL}/assets/pictures/TripPicture.svg`,
      },
      {
        id: 2,
        cabinName: 'Knausen',
        season: 'Uke 12',
        date: '12.04.2023',
        approved: 'pending',
        active: false,
        picture: `${process.env.PUBLIC_URL}/assets/pictures/TripPicture.svg`,
      },
      {
        id: 3,
        cabinName: 'Fanitullen',
        season: 'Uke 2',
        date: '14.01.2023',
        approved: 'approved',
        active: true,
        picture: `${process.env.PUBLIC_URL}/assets/pictures/TripPicture.svg`,
      },
      {
        id: 4,
        cabinName: 'Store Grøndalen',
        season: 'Uke 13',
        date: '19.04.2023',
        approved: 'pending',
        active: false,
        picture: `${process.env.PUBLIC_URL}/assets/pictures/TripPicture.svg`,
      },
    ],
  };

  return (
    <>
      <div className="mytrip-container">
        <HeroBanner name="Mine turer" />
        <div className="mytrip-card-wrapper">
          <p className="mytrip-title">Krever handling:</p>
          <div className="trip-row-wrapper">
            <TripCardActionReq data={data.applications[0]} />
          </div>
        </div>
        <hr />
        <div className="mytrip-card-wrapper">
          <p className="mytrip-title">Venter på godkjenning:</p>
          <div className="trip-row-wrapper">
            <TripCardPending data={data.applications[1]} />
            <TripCardPending data={data.applications[3]} />
          </div>
        </div>
        <hr />
        <div className="mytrip-card-wrapper">
          <p className="mytrip-title">Dine fremtidige turer:</p>
          <div className="trip-row-wrapper">
            <TripCardActive data={data.applications[2]} />
          </div>
        </div>
        <BigButton name="Vis tidligere turer" />
      </div>
    </>
  );
};

export default MineTurer;
