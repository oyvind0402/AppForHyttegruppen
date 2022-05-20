import { useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { Link, useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie';
import AlertPopup from '../PopUp/AlertPopup';
import InfoPopup from '../PopUp/InfoPopup';
import './TripCard.css';

const TripCardActive = (props) => {
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const [tooLateError, setTooLateError] = useState(false);

  if (
    props.data === null ||
    typeof props.data === undefined ||
    props.data.length === 0
  ) {
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

  const handleTooLateError = () => {
    setTooLateError(!tooLateError);
  };

  const cancelTrip = async () => {
    setVisible(false);
    let diffTime = Math.abs(
      Date.now() - new Date(props.data.period.start).getTime()
    );
    if (Date.now() > new Date(props.data.period.start).getTime()) {
      diffTime = diffTime * -1;
    }
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    console.log(diffDays);

    if (diffDays <= 7) {
      setTooLateError(true);
      return;
    }

    const cookies = new Cookies();

    try {
      const response = await fetch('/api/application/delete', {
        method: 'DELETE',
        body: JSON.stringify(props.data.applicationId),
        headers: { token: cookies.get('token') },
      });

      if (response.ok) {
        fetch('/api/email/cancelledTrip', {
          method: 'POST',
          body: JSON.stringify({
            period: props.data.period,
            cabinsWon: props.data.cabinsWon,
            user: props.data.user,
          }),
        })
          .then((response) => response.json())
          .catch((error) => console.log(error));
        history.go(0);
      }
    } catch (error) {
      console.log(error);
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
              <p className="card-title">
                {props.data.cabinsWon.length > 1
                  ? 'Tildelt ' + props.data.cabinsWon.length + ' hytter'
                  : props.data.cabinsWon[0].cabinName}
              </p>
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
      {tooLateError && (
        <InfoPopup
          title="Avbestilling av tur"
          description="Du kan ikke avbestille en tur som har startdato innen 7 dager! Kontakt oss hvis du fortsatt vil avbestille."
          hideMethod={handleTooLateError}
          btnText="Ok"
        />
      )}
    </>
  );
};

export default TripCardActive;
