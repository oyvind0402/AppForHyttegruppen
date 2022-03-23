import { useContext, useEffect, useState } from 'react';
import LoginContext from '../../LoginContext/login-context';
import CabinCardBig from '../01-Reusable/CabinCard/CabinCardBig';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import './Cabins.css';
import { Map, Marker } from 'pigeon-maps';
import CabinCardMap from '../01-Reusable/CabinCard/CabinCardMap';

const Cabins = () => {
  const loginContext = useContext(LoginContext);
  const loggedIn = loginContext.loggedIn;

  const color = `hsl(271, 76%, 53%)`;

  const hytte = {
    Utsikten: {
      Name: 'Utsikten',
      Address: 'Grøndalsvegen 764',
      Bedrooms: '5',
      SleepingSlots: '10',
      Bathrooms: '1',
      coordinates: [60.931893, 8.410129],
    },
    Hytte3: {
      Name: 'NyHytte',
      Address: 'AnnenVEg',
      Bedrooms: '10',
      SleepingSlots: '15',
      Bathrooms: '2',
      coordinates: [60.862751, 8.552822],
    },
  };

  const [cabincard, setCabinCard] = useState(hytte.Utsikten);

  return (
    <>
      <HeroBanner name="Hytter" />
      <div className="cabins-display">
        <CabinCardBig />
        <CabinCardBig />
        <CabinCardBig />
        <CabinCardBig />
      </div>
      <div className="map">
        <Map
          height={500}
          width={'80vw'}
          defaultCenter={[60.931893, 8.410129]}
          defaultZoom={11}
        >
          <Marker
            width={50}
            anchor={hytte.Utsikten.coordinates}
            color={color}
            onClick={() => setCabinCard(hytte.Utsikten)}
          />
          <Marker
            width={50}
            anchor={hytte.Hytte3.coordinates}
            color={color}
            onClick={() => setCabinCard(hytte.Hytte3)}
          />
          <CabinCardMap cabin={cabincard} />
        </Map>
      </div>
    </>
  );
};

export default Cabins;
