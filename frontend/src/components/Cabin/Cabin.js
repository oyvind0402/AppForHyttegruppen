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
  const [pageID, setPageID] = useState('');
  const [zoom, setZoom] = useState(11);

  useEffect(() => {
    const link = window.location.href;
    const hytte = link.split('/')[4];
    setPageID(hytte);
  }, []);

  useEffect(() => {
    async function getCabin(pageId) {
      fetch(`/api/cabin/` + pageId)
        .then((response) => response.json())
        .then((data) => setCabinData(data))
        .catch((error) => console.log(error));
    }

    if (pageID !== '') {
      getCabin(pageID);
    }
  }, [pageID]);

  useEffect(() => {
    async function fetchData() {
      fetch('/api/cabin/all')
        .then((response) => response.json())
        .then((data) => setCabins(data))
        .catch((error) => console.log(error));
    }
    fetchData();
  }, []);

  const loadInfoTab = (infoTab) => {
    switch (infoTab) {
      case 1:
        if (
          cabinData !== null &&
          typeof cabinData !== undefined &&
          cabinData !== ''
        ) {
          return <UtvidetInfo cabinData={cabinData} />;
        } else {
          return <></>;
        }

      case 2:
        if (
          cabinData !== null &&
          typeof cabinData !== undefined &&
          cabinData !== ''
        ) {
          return <Huskeliste cabinData={cabinData} />;
        } else {
          return <></>;
        }

      case 3:
        if (
          cabinData !== null &&
          typeof cabinData !== undefined &&
          cabinData !== ''
        ) {
          return <Veibeskrivelse cabinData={cabinData} />;
        } else {
          return <></>;
        }

      default:
        if (
          cabinData !== null &&
          typeof cabinData !== undefined &&
          cabinData !== ''
        ) {
          return <Features cabinData={cabinData} />;
        } else {
          return <></>;
        }
    }
  };

  return (
    <>
      <BackButton name="Tilbake til hytter" link="hytter" />
      <HeroBanner name={cabinData.name} />
      <div className="cabin-display">
        {cabinData !== null &&
          typeof cabinData !== undefined &&
          cabinData !== '' && <Carousel cabinData={cabinData} />}
        <TabPicker setInfoTab={setInfoTab} active={infoTab} />
        {loadInfoTab(infoTab)}
        <Apply cabinData={cabinData} />
      </div>
      {cabinData !== '' &&
        cabinData !== null &&
        typeof cabinData !== undefined && (
          <>
            <div className="map-elements">
              <div className="map-zoom-elements">
                <button
                  className="map-zoom-btn"
                  onClick={() => setZoom(zoom + 1)}
                >
                  +
                </button>
                <button
                  className="map-zoom-btn"
                  onClick={() => setZoom(zoom - 1)}
                >
                  -
                </button>
              </div>
              <MapSingleCabin
                cabins={cabins}
                pickedCabin={cabinData}
                zoom={zoom}
                setZoom={setZoom}
              />
            </div>
          </>
        )}
    </>
  );
};

export default Cabin;
