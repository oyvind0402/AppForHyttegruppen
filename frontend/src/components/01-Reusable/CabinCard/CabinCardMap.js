import './CabinCard.css';
import './CabinCardMap.css';
import { BiBed } from 'react-icons/bi';
import { BiBath } from 'react-icons/bi';

const CabinCardMap = (props) => {
  if (typeof props.cabin.features !== 'undefined') {
    return (
      <>
        <div className="card-map">
          <h2 className="card-map-title">{props.cabin.name}</h2>
          <p className="card-map-address">{props.cabin.address}</p>

          <div className="card-map-features">
            <BiBed className="card-icon bed" />
            <p className="card-map-text bedrooms">
              {props.cabin.features.soverom} soverom /{' '}
              {props.cabin.features.sengeplasser} sengeplasser
            </p>

            <BiBath className="card-icon bath" />
            <p className="card-map-text badrooms">
              {props.cabin.features.bad} Bad
            </p>

            <button className="card-map-btn">Se mer</button>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div className="card-map">
        <h2 className="card-map-title">Velg en hytte</h2>
      </div>
    );
  }
};

export default CabinCardMap;

/*<div className="card-map">
        <h2 className="card-map-title">{props.cabin.name}</h2>
        <p className="card-map-address">{props.cabin.address}</p>

        <div className="card-map-features">
          <BiBed className="card-icon bed" />
          <p className="card-map-text bedrooms">
            {props.cabin.features.soverom soverom /{' '}
            {props.cabin.features.sengeplasser} sengeplasser
          </p>

          <BiBath className="card-icon bath" />
          <p className="card-map-text badrooms">
            {props.cabin.features.bad} Bad
          </p>

          <button className="card-map-btn">Se mer</button>
        </div>
      </div>
*/
