import './CabinCardSmall.css';
import { BiBed } from 'react-icons/bi';
import { BiBath } from 'react-icons/bi';

const CabinContent = (props) => {
  if (typeof props.cabin === 'undefined' || props.cabin === null) {
    return <></>;
  }

  return (
    <>
      <img
        className="card-picture-small"
        src={`${process.env.PUBLIC_URL}/assets/pictures/${props.cabin.pictures.mainPicture.filename}`}
        alt={props.cabin.pictures.mainPicture.altText}
      />
      <div className="card-content-small">
        <h2 className="card-title">{props.cabin.name}</h2>
        <p className="card-address">{props.cabin.address}</p>

        <div className="card-features-small">
          <BiBed className="card-icon-small bed" aria-label="Bed icon" />
          <p className="card-text sleepingslots">
            {props.cabin.features.sengeplasser} senger
          </p>

          <BiBath className="card-icon-small bath" aria-label="Bathroom icon" />
          <p className="card-text badrooms">{props.cabin.features.bad} Bad</p>
        </div>
      </div>
    </>
  );
};

export default CabinContent;
