import './../../Cabins/Cabins.css';
import { Map, Marker } from 'pigeon-maps';
import Cluster from 'pigeon-cluster';
import CabinCardMap from '../CabinCard/CabinCardMap';
import { useState, useEffect } from 'react';

const MapCabins = (props) => {
  const color = `hsl(271, 76%, 53%)`;
  const cabins = props.cabins;
  const [cabinCard, setCabinCard] = useState(props.pickedCabin);
  const pickedCabin = props.pickedCabin;
  const [center, setCenter] = useState([
    pickedCabin.coordinates.latitude,
    pickedCabin.coordinates.longitude,
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
          onBoundsChanged={({ center, zoom }) => {
            setCenter(center);
            props.setZoom(zoom);
          }}
        >
          {cabins[0] !== '' && (
            <Cluster>
              {cabins.map((cabin, index) => {
                let cabinPicked = false;
                //if cabin is same as picked and the cabinCard name = picked than the color is set to gray
                if (
                  cabin.name === pickedCabin.name &&
                  cabinCard.name === pickedCabin.name
                )
                  cabinPicked = true;
                return (
                  <Marker
                    key={index}
                    width={50}
                    anchor={[
                      cabin.coordinates.latitude,
                      cabin.coordinates.longitude,
                    ]}
                    color={cabinPicked ? '#666666' : color}
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
        </Map>
      </div>
      <div className="cabincardmap">
        {cabinCard.name === pickedCabin.name ? (
          <CabinCardMap cabin={cabinCard} showSeeMore={true} />
        ) : (
          <CabinCardMap cabin={cabinCard} showSeeMore={true} />
        )}
      </div>
    </>
  );
};

export default MapCabins;
