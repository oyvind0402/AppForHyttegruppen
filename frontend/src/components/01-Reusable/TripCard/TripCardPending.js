import { MdOutlineCancel } from 'react-icons/md';
import { BsHourglassSplit } from 'react-icons/bs';
import './TripCard.css';
import { Link, useHistory } from 'react-router-dom';
import { useState } from 'react';
import AlertPopup from '../PopUp/AlertPopup';

const TripCardPending = (props) => {
  const history = useHistory();
  const [visible, setVisible] = useState(false);

  if (
    props.data === null ||
    typeof props.data === undefined ||
    props.data.length === 0
  ) {
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

  const handleVisibility = () => {
    setVisible(!visible);
  };

  const cancelTrip = async () => {
    setVisible(false);
    const response = await fetch('/application/delete', {
      method: 'DELETE',
      body: JSON.stringify(props.data.applicationId),
      headers: { token: localStorage.getItem('refresh_token') },
    });

    const data = await response.json();
    if (response.ok) {
      console.log(data);
      history.go(0);
    }
  };

  return (
    <>
      <div className="relative-container">
        <Link
          to={'/mintur/' + props.data.applicationId}
          className="mintur-link"
        >
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
            </div>
          </div>
        </Link>
        <div className="cancel-container" onClick={handleVisibility}>
          <MdOutlineCancel className="cancel-icon" />
          <p className="cancel-text">Slett</p>
        </div>
      </div>
      {visible && (
        <AlertPopup
          title="Sletting av søknad"
          description="Er du sikker på at du vil slette søknaden? Hvis ja, trykk slett!"
          acceptMethod={cancelTrip}
          cancelMethod={handleVisibility}
          negativeAction="Avbryt"
          positiveAction="Slett"
        />
      )}
    </>
  );
};

export default TripCardPending;
