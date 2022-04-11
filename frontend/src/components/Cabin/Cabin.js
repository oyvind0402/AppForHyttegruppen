import { useContext, useState, useEffect } from 'react';
import LoginContext from '../../LoginContext/login-context';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import Carousel from '../01-Reusable/ImageCarousel/Carousel';
import './Cabin.css';
import Features from './Parts/Features';
import { Map, Marker } from 'pigeon-maps';
import Cluster from 'pigeon-cluster';
import CabinCardMap from '../01-Reusable/CabinCard/CabinCardMap';

const Cabin = () => {
  const loginContext = useContext(LoginContext);
  const loggedIn = loginContext.loggedIn;

  const link = window.location.href;
  const pageID = link.split('/');

  useEffect(() => {
    async function getCabin(pageId) {
      console.log(pageId);
      fetch(`/cabin/${pageId}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => setCabinData(data))
        .catch((error) => console.log(error));
    }
    getCabin(pageID[pageID.length - 1]);
  }, []);

  const [cabinData, setCabinData] = useState({});
  const [cabins, setCabins] = useState([]);
  const [cabincard, setCabinCard] = useState({});
  const color = `hsl(271, 76%, 53%)`;

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
      <HeroBanner name={cabinData.name} />
      <div className="cabin-display">
        <Carousel cabinData={cabinData} />
        <Features cabinData={cabinData} />
        <div className="map">
          <Map
            height={500}
            width={`80%`}
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
      </div>
    </>
  );
};

export default Cabin;
