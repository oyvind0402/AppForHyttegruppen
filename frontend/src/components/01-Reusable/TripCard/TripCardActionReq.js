import { AiOutlineWarning } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import './TripCard.css';

const TripCardActionReq = (props) => {
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
          <div className="handling-info">
            <AiOutlineWarning className="warning-icon" />
            <p className="warning-text">Handling kreves</p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default TripCardActionReq;
