import { MdOutlineCancel } from 'react-icons/md';
import { Link } from 'react-router-dom';
import './TripCard.css';

const TripCardActive = (props) => {
  return (
    <>
      <Link to={'/mintur/' + props.data.id} className="mintur-link">
        <div className="mytrip-card-container">
          <img
            className={
              props.data.active ? 'mytrip-picture' : 'mytrip-picture-blur'
            }
            src={props.data.picture}
            alt="picture of the cabin for the trip"
          />
          <div className="card-info">
            <p className="card-title">{props.data.cabinName}</p>
            <div className="season-date-wrapper">
              <p className="card-season">{props.data.season}</p>
              <p className="card-date">({props.data.date})</p>
            </div>
          </div>
          <div className="cancel-box">
            <div className="cancel-container">
              <MdOutlineCancel className="cancel-icon" />
              <p className="cancel-text">Avbestill</p>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default TripCardActive;
