import './../../Cabins/Cabins.css';
import './Map.css';
import { Map, Marker } from 'pigeon-maps';
import Cluster from 'pigeon-cluster';
import CabinCardMap from '../../01-Reusable/CabinCard/CabinCardMap';
import { useEffect, useState } from 'react';

const MapCabins = (props) => {
  const color = `hsl(271, 76%, 53%)`;
  const cabins = props.cabins;
  const [cabinCard, setCabinCard] = useState('');
  const [center, setCenter] = useState([
    cabins[0].coordinates.latitude,
    cabins[0].coordinates.longitude,
  ]);

  const zoom = props.zoom;

  useEffect(() => {
    function handleResize() {
      let map = document.evaluate(
        '//*[@id="root"]/main/div/div[3]/div',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      if (map !== null) map.style.width = '100%';
    }

    window.addEventListener('resize', handleResize);
  });

  return (
    <>
      <div className="map">
        <Map
          height={500}
          center={center}
          zoom={zoom}
          className={'pigeon-map'}
          onBoundsChanged={({ center, zoom }) => {
            setCenter(center);
            props.setZoom(zoom);
          }}
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
                    onClick={(e) => {
                      setCabinCard(cabin);

                      const listMarkers =
                        document.getElementsByClassName('clicked');
                      for (let i = 0; i < listMarkers.length; i++) {
                        try {
                          listMarkers[i].classList.remove('clicked');
                        } catch (error) {
                          //no sush class
                        }
                      }
                      //Making sure path is selected and not circle
                      let element = e.event.target;
                      if (element.tagName === 'circle') {
                        element = e.event.target.previousElementSibling;
                      }
                      element.classList.add('clicked');
                    }}
                  />
                );
              })}
            </Cluster>
          )}
          <CabinCardMap cabin={cabinCard} showSeeMore={true} />
        </Map>
      </div>
    </>
  );
};

export default MapCabins;
