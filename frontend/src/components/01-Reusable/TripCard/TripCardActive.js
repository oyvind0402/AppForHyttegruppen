import { useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { Link, useHistory } from 'react-router-dom';
import AlertPopup from '../PopUp/AlertPopup';
import './TripCard.css';

const TripCardActive = (props) => {
  const history = useHistory();
  const [visible, setVisible] = useState(false);

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

  const handleVisibility = () => {
    setVisible(!visible);
  };

  const cancelTrip = async () => {
    //Should add a way to send an email to admins if its cancelled close to the start date
    //Should also add a date thats the latest you can cancel a trip
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
              className={'mytrip-picture'}
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
          </div>
        </Link>
        <div className="cancel-container" onClick={handleVisibility}>
          <MdOutlineCancel className="cancel-icon" />
          <p className="cancel-text">Avbestill</p>
        </div>
      </div>
      {visible && (
        <AlertPopup
          title="Avbestilling av tur"
          description="Er du sikker på at du vil avbestille turen? Hvis ja, trykk avbestill!"
          acceptMethod={cancelTrip}
          cancelMethod={handleVisibility}
          negativeAction="Avbryt"
          positiveAction="Avbestill"
        />
      )}
    </>
  );
};

export default TripCardActive;
