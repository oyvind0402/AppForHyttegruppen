import { MdOutlineCancel } from 'react-icons/md';
import { BsHourglassSplit } from 'react-icons/bs';
import './TripCard.css';
import { Link } from 'react-router-dom';

const TripCardPending = (props) => {
  console.log(props);
  if (props.data.length === 0) {
    return <></>;
  }

  const date = new Date(props.data.period.start);
  function getFormattedDate(date, answer) {
    if (!answer) {
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
    } else {
      date.setDate(date.getDate() - 7);

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
            <p className="card-title">
              {props.data.cabins.length > 1
                ? 'Søkt på ' + props.data.cabins.length + ' hytter'
                : props.data.cabins[0].cabinName}
            </p>
            <div className="season-date-wrapper">
              <p className="card-season">{props.data.period.name}</p>
              <p className="card-date">({getFormattedDate(date, false)})</p>
            </div>
            <div>
              <p className="pending-text">Svar forventes:</p>
              <p className="pending-date">({getFormattedDate(date, true)})</p>
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
