import './CabinCardSmall.css';
import { BiBed } from 'react-icons/bi';
import { BiBath } from 'react-icons/bi';

const CabinContent = (props) => {
  return (
    <>
      <img
        className="card-picture-small"
        src={`${process.env.PUBLIC_URL}/assets/pictures/cabin-main.jpg`}
        alt={props.cabin.picture[0].alt}
      />
      <div className="card-content-small">
        <h2 className="card-title">{props.cabin.picture[0].Name}</h2>
        <p className="card-address">{props.cabin.picture[0].Address}</p>

        <div className="card-features-small">
          <BiBed className="card-icon-small bed" />
          <p className="card-text sleepingslots">
            {props.cabin.picture[0].SleepingSlots} senger
          </p>

          <BiBath className="card-icon-small bath" />
          <p className="card-text badrooms">
            {props.cabin.picture[0].Bathrooms} Bad
          </p>
        </div>
      </div>
    </>
  );
};

export default CabinContent;

/*
<img
        className="card-picture-small"
        src={`${process.env.PUBLIC_URL}/assets/pictures/cabin-main.jpg`}
      />
*/

/*        <p className="card-address"></p>

        <div className="card-features-small">
          <BiBed className="card-icon-small bed" />
          <p className="card-text sleepingslots"> sengeplasser</p>

          <BiBath className="card-icon-small bath" />
          <p className="card-text badrooms"> Bad</p>
        </div>*/
