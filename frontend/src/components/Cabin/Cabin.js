import { useState, useEffect } from 'react';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import Carousel from '../01-Reusable/ImageCarousel/Carousel';
import './Cabin.css';
import Features from './InfoParts/Features';
import UtvidetInfo from './InfoParts/UtvidetInfo';
import Veibeskrivelse from './InfoParts/Veibeskrivelse';
import { Apply } from './InfoParts/Apply';
import { TabPicker } from './InfoParts/TabPicker';
import MapSingleCabin from '../01-Reusable/MapCabin/MapSingleCabin';
import Huskeliste from './InfoParts/Huskeliste';
import BackButton from '../01-Reusable/Buttons/BackButton';

const Cabin = () => {
  const [cabinData, setCabinData] = useState('');
  const [cabins, setCabins] = useState([]);
  const [infoTab, setInfoTab] = useState(0);

  const link = window.location.href;
  const pageID = link.split('/');

  useEffect(() => {
    async function getCabin(pageId) {
      fetch(`/cabin/${pageId}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => setCabinData(data))
        .catch((error) => console.log(error));
    }
    getCabin(pageID[pageID.length - 1]);
  }, [pageID]);

  useEffect(() => {
    async function fetchData() {
      fetch('/cabin/all')
        .then((response) => response.json())
        .then((data) => setCabins(data))
        .catch((error) => console.log(error));
    }
    fetchData();
  }, []);

  const loadInfoTab = (infoTab) => {
    switch (infoTab) {
      case 1:
        return <UtvidetInfo cabinData={cabinData} />;
      case 2:
        return <Huskeliste cabinData={cabinData} />;
      case 3:
        return <Veibeskrivelse cabinData={cabinData} />;
      default:
        return <Features cabinData={cabinData} />;
    }
  };

  return (
    <>
      <BackButton name="Tilbake til hytter" link="hytter" />
      <HeroBanner name={cabinData.name} />
      <div className="cabin-display">
        <Carousel cabinData={cabinData} />
        <TabPicker setInfoTab={setInfoTab} active={infoTab} />
        {loadInfoTab(infoTab)}
        <Apply cabinData={cabinData} />
        {cabinData !== '' && (
          <MapSingleCabin cabins={cabins} pickedCabin={cabinData} />
        )}
      </div>
    </>
  );
};

export default Cabin;
