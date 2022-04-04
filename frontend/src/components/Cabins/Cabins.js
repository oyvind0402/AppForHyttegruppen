import { useContext, useState, useEffect } from 'react';
import LoginContext from '../../LoginContext/login-context';
import CabinCardBig from '../01-Reusable/CabinCard/CabinCardBig';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import './Cabins.css';
import { Map, Marker } from 'pigeon-maps';
import Cluster from 'pigeon-cluster';
import CabinCardMap from '../01-Reusable/CabinCard/CabinCardMap';
import { GiConsoleController } from 'react-icons/gi';

const Cabins = () => {
  const loginContext = useContext(LoginContext);
  //const loggedIn = loginContext.loggedIn;
  //Color of the markers
  const color = `hsl(271, 76%, 53%)`;

  const [cabins, setCabins] = useState(['']);
  const [cabincard, setCabinCard] = useState({});

  //Fetching
  useEffect(() => {
    async function fetchData() {
      fetch('/cabin/all')
        .then((response) => response.json())
        .then((data) => setCabins(data))
        .catch((error) => console.log(error));
    }
    fetchData();
  }, []);

  return (
    <>
      {console.log(cabins[0])}
      <HeroBanner name="Hytter" />
      <div className="cabins-display">
        {cabins[0] !== '' &&
          cabins.map((cabin, index) => {
            return <CabinCardBig key={index} cabin={cabin} />;
          })}
      </div>
      <div className="map">
        <Map
          height={500}
          width={'80vw'}
          defaultCenter={[60.89923, 8.574017]}
          defaultZoom={10}
        >
          {cabins[0] !== '' && (
            <Cluster>
              {cabins.map((cabin, index) => {
                return (
                  <Marker
                    key={index}
                    width={50}
                    anchor={[
                      cabin.coordinates.latitude,
                      cabin.coordinates.longitude,
                    ]}
                    color={color}
                    onClick={() => setCabinCard(cabin)}
                  />
                );
              })}
            </Cluster>
          )}
          <CabinCardMap cabin={cabincard} />
        </Map>
      </div>
    </>
  );
};

export default Cabins;
