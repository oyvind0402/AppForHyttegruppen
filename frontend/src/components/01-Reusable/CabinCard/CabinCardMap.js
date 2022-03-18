import './CabinCard.css';
import './CabinCardMap.css';
import { BiBed } from 'react-icons/bi';
import { BiBath } from 'react-icons/bi';

const CabinCardMap = (props) => {
  return (
    <>
      <div className="card-map">
        <h2 className="card-map-title">{props.cabin.Name}</h2>
        <p className="card-map-address">{props.cabin.Address}</p>

        <div className="card-map-features">
          <BiBed className="card-icon bed" />
          <p className="card-map-text bedrooms">
            {props.cabin.Bedrooms} soverom / {props.cabin.SleepingSlots}{' '}
            sengeplasser
          </p>

          <BiBath className="card-icon bath" />
          <p className="card-map-text badrooms">{props.cabin.Bathrooms} Bad</p>

          <button className="card-map-btn">Se mer</button>
        </div>
      </div>
    </>
  );
};

export default CabinCardMap;
