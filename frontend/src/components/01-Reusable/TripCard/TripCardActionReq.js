import { AiOutlineWarning } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import './TripCard.css';

const TripCardActionReq = (props) => {
  console.log(props.data);

  if (props.data.length === 0) {
    return <></>;
  }

  const date = new Date(props.data.period.start);
  function getFormattedDate(date) {
    let year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    if (month.length < 2) {
      month = '0' + month;
    }
    let day = date.getDate().toString();
    if (day.length < 2) {
      day = '0' + day;
    }
    return day + '/' + month + '/' + year;
  }

  return (
    <>
      <Link to={'/mintur/' + props.data.applicationId} className="mintur-link">
        <div className="mytrip-card-container">
          <img
            className={'mytrip-picture-blur'}
            src={process.env.PUBLIC_URL + '/assets/pictures/TripPicture.svg'}
            alt="the cabin for the trip"
          />
          <div className="card-info">
            <p className="card-title">{props.data.cabins[0].cabinName}</p>
            <div className="season-date-wrapper">
              <p className="card-season">{props.data.period.name}</p>
              <p className="card-date">({getFormattedDate(date)})</p>
            </div>
          </div>
          <div className="handling-info">
            <div className="warning">
              <AiOutlineWarning className="warning-icon" />
              <p className="warning-text">Handling kreves</p>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default TripCardActionReq;
