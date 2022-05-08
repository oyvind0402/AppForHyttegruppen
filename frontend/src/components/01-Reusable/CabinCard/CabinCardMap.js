import './CabinCard.css';
import './CabinCardMap.css';
import { BiBed } from 'react-icons/bi';
import { BiBath } from 'react-icons/bi';

const CabinCardMap = (props) => {
  if (typeof props.cabin === 'undefined' || props.cabin === null) {
    return <></>;
  }

  if (typeof props.cabin.features !== 'undefined') {
    return (
      <>
        <div className="card-map">
          <h2 className="card-map-title">{props.cabin.name}</h2>
          <p className="card-map-address">{props.cabin.address}</p>

          <div className="card-map-features">
            <BiBed className="card-icon bed" aria-label="Bed icon" />
            <p className="card-map-text bedrooms">
              {props.cabin.features.soverom} soverom /{' '}
              {props.cabin.features.sengeplasser} senger
            </p>

            <BiBath className="card-icon bath" aria-label="Bathroom icon" />
            <p className="card-map-text badrooms">
              {props.cabin.features.bad} Bad
            </p>

            {props.showSeeMore ? (
              <button
                className="card-map-btn"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/hytte/${props.cabin.name}`;
                }}
              >
                Se mer
              </button>
            ) : (
              <button
                className="card-map-btn"
                onClick={(e) => {
                  window.scrollTo(0, 0);
                }}
              >
                Se mer
              </button>
            )}
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
