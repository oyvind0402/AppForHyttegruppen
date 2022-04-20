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

  useEffect(() => {
    function handleResize() {
      let map = document.evaluate(
        '//*[@id="root"]/main/div/div[2]/div[5]/div',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      map.style.width = '100%';
    }

    window.addEventListener('resize', handleResize);
  });

  return (
    <>
      <div className="map">
        <Map
          height={500}
          width={`100%`}
          defaultCenter={[
            pickedCabin.coordinates.latitude,
            pickedCabin.coordinates.longitude,
          ]}
          defaultZoom={13}
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
          <CabinCardMap cabin={cabinCard} />
        </Map>
      </div>
    </>
  );
};

export default MapCabins;
