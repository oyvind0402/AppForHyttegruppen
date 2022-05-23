import { useState, useEffect } from 'react';
import CabinCardBig from '../01-Reusable/CabinCard/CabinCardBig';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import './Cabins.css';
import '../01-Reusable/MapCabin/Map.css';
import MapSingleCabin from '../01-Reusable/MapCabin/MapSingleCabin';

const Cabins = () => {
  const [cabins, setCabins] = useState([]);
  const [zoom, setZoom] = useState(11);

  //Fetching
  useEffect(() => {
    async function fetchData() {
      fetch('/api/cabin/active')
        .then((response) => response.json())
        .then((data) => setCabins(data))
        .catch((error) => console.log(error));
    }
    fetchData();
  }, []);

  return (
    <>
      <HeroBanner name="Hytter" />
      <div className="cabins-display">
        {cabins.length > 0 ? (
          cabins !== null &&
          typeof cabins !== undefined &&
          cabins.map((cabin, index) => {
            return <CabinCardBig key={index} cabin={cabin} />;
          })
        ) : (
          <p className="cabins-error-empty">
            Det har oppstått tekniske problemer. Ingen hytter tilgjengelige
            akkurat nå.
          </p>
        )}
      </div>
      {cabins.length > 0 && cabins !== null && typeof cabins !== undefined && (
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
              pickedCabin={cabins[0]}
              zoom={zoom}
              setZoom={setZoom}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Cabins;
