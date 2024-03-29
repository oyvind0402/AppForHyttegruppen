import { useState } from 'react';
import { AiOutlineWarning } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import InfoPopup from '../PopUp/InfoPopup';
import './TripCard.css';

const TripCardActionReq = (props) => {
  const [visible, setVisible] = useState(false);
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

  const showInformation = () => {
    setVisible(!visible);
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
        <div className="handling-info">
          <div className="warning" onClick={showInformation}>
            <AiOutlineWarning
              className="warning-icon"
              aria-label="Needs attention"
              role="button"
            />
            <p className="warning-text">Handling kreves</p>
          </div>
        </div>
      </div>

      {visible && (
        <InfoPopup
          title="Handling kreves"
          description="Handling kreves betyr at du ikke har fyllt inn tilbakemeldingsskjemaet, trykk på turen for å fylle det ut og sende det inn!"
          btnText="Ok"
          hideMethod={showInformation}
        />
      )}
    </>
  );
};

export default TripCardActionReq;
