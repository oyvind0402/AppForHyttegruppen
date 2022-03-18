import { MdOutlineCancel } from 'react-icons/md';
import { BsHourglassSplit } from 'react-icons/bs';
import './TripCard.css';
import { Link } from 'react-router-dom';

//We'll get this date from somewhere idk where yet :D
const replyDate = '01.04.2023';

const TripCardPending = (props) => {
  return (
    <>
      <Link to={'/mintur/' + props.data.id} className="mintur-link">
        <div className="mytrip-card-container">
          <img
            className={
              props.data.active ? 'mytrip-picture' : 'mytrip-picture-blur'
            }
            src={props.data.picture}
            alt="the cabin for the trip"
          />
          <div className="card-info">
            <p className="card-title">{props.data.cabinName}</p>
            <div className="season-date-wrapper">
              <p className="card-season">{props.data.season}</p>
              <p className="card-date">({props.data.date})</p>
            </div>
            <div>
              <p className="pending-text">Svar forventes:</p>
              <p className="pending-date">({replyDate})</p>
            </div>
          </div>
          <div className="cancel-box">
            <div className="pending-container">
              <BsHourglassSplit className="pending-icon" />
            </div>
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

export default TripCardPending;
