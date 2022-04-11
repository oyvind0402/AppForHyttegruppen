import './../../Cabins/Cabins.css';
import { Map, Marker } from 'pigeon-maps';
import Cluster from 'pigeon-cluster';
import CabinCardMap from '../../01-Reusable/CabinCard/CabinCardMap';
import { useState } from 'react';

const MapCabins = (props) => {
  const color = `hsl(271, 76%, 53%)`;

  const cabins = props.cabins;
  const [cabinCard, setCabinCard] = useState('');
  const pickedCabin = props.pickedCabin;

  return (
    <>
      <div className="map">
        <Map
          height={500}
          width={`80%`}
          defaultCenter={[
            cabins[0].coordinates.latitude,
            cabins[0].coordinates.longitude,
          ]}
          defaultZoom={11}
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
          <CabinCardMap cabin={cabinCard} />
        </Map>
      </div>
    </>
  );
};

export default MapCabins;
