import { useContext, useState, useEffect } from 'react';
import LoginContext from '../../LoginContext/login-context';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import Carousel from '../01-Reusable/ImageCarousel/Carousel';
import './Cabin.css';
import Features from './Parts/Features';
import { Map, Marker } from 'pigeon-maps';
import Cluster from 'pigeon-cluster';
import CabinCardMap from '../01-Reusable/CabinCard/CabinCardMap';
import MapSingleCabin from '../01-Reusable/MapCabin/MapSingleCabin';

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

  const [cabinData, setCabinData] = useState('');
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
        <Features cabinData={cabinData} />{' '}
        {cabinData !== '' && (
          <MapSingleCabin cabins={cabins} pickedCabin={cabinData} />
        )}
      </div>
    </>
  );
};

export default Cabin;
