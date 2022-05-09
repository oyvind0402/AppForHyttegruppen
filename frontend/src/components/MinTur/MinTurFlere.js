import { useEffect, useState } from 'react';
import { BiBed } from 'react-icons/bi';
import { BsWifi, BsWifiOff } from 'react-icons/bs';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { GiTakeMyMoney } from 'react-icons/gi';
import { MdShower } from 'react-icons/md';
import BackButton from '../01-Reusable/Buttons/BackButton';
import FeedbackForm from '../01-Reusable/FeedbackForm/FeedbackForm';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import AlertPopup from '../01-Reusable/PopUp/AlertPopup';
import InfoPopup from '../01-Reusable/PopUp/InfoPopup';
import './MinTur.css';

const MinTurFlere = (props) => {
  const [cabinWon, setCabinWon] = useState('');

  const changeCabinInfo = (value) => {
    props.cabinsWon.forEach((cabin) => {
      if (value === cabin.name) {
        setCabinWon(cabin);
      }
    });
  };

  useEffect(() => {
    setCabinWon(props.cabinsWon[0]);
  }, [props.cabinsWon]);

  if (props.start > Date.now() && props.trip.winner) {
    return (
      <>
        <BackButton name="Tilbake til mine turer" link="mineturer" />
        <HeroBanner name="Min tur" />
        <div className="mintur-container">
          <div className="titlepic-wrapper">
            <p className="mintur-title">{props.length + ' hytter tildelt'}</p>

            <select
              onChange={(e) => changeCabinInfo(e.target.value)}
              id="cabin-select"
              className="mintur-select"
            >
              {typeof props.cabinsWon !== undefined &&
                props.cabinsWon !== '' &&
                props.trip.cabinsWon.map((cabin) => {
                  return (
                    <option value={cabin.cabinName}>{cabin.cabinName}</option>
                  );
                })}
            </select>
            <img
              src={
                cabinWon !== '' && typeof cabinWon.pictures !== undefined
                  ? `${process.env.PUBLIC_URL}/assets/pictures/` +
                    cabinWon.pictures.mainPicture.filename
                  : `${process.env.PUBLIC_URL}/assets/pictures/MyTripPic.svg`
              }
              className="mintur-picture"
              alt="cabin"
            />
          </div>
          <div className="secondrow-wrapper">
            <div className="info-container">
              <p className="info-title">Reise informasjon</p>
              <div className="travelinfo-wrapper">
                <div className="checkin-info">
                  <p>Innsjekking</p>
                  <p>{props.getFormattedDate(props.start, false)}</p>
                  <p>17:00</p>
                </div>
                <div className="image-wrapper-mintur">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/icons/FlyingIcon.svg`}
                    alt="indicating travel"
                    className="travel-icon"
                  />
                </div>
                <div className="checkout-info">
                  <p>Utsjekking</p>
                  <p>{props.getFormattedDate(props.end, false)}</p>
                  <p>12:00</p>
                </div>
              </div>
            </div>
            <div className="checklist-container">
              <p className="checklist-title">Ta med</p>
              <div className="checklist">
                <div className="checklist-wrapper">
                  {cabinWon !== '' &&
                    typeof cabinWon.other !== undefined &&
                    cabinWon.other.huskeliste !== null &&
                    typeof cabinWon.other.huskeliste !== undefined &&
                    cabinWon.other.huskeliste.map((item, index) => {
                      return (
                        <p key={index} className="checklist-item">
                          {item}
                        </p>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
          <div className="omhytta-container">
            <p className="omhytta-title">Om hytta</p>
            <div className="hytteinfo-container">
              <div className="hytteinfo1-wrapper">
                <FaMapMarkerAlt className="info-icon marker-icon" />
                <div className="address-text">
                  <p className="omhytta-text">
                    {cabinWon !== '' &&
                      typeof cabinWon.address !== undefined &&
                      cabinWon.address + ','}
                  </p>
                  <p className="omhytta-text">Hemsedal</p>
                </div>

                <BiBed className="info-icon bed-icon" />
                <p className="omhytta-text bed-text">
                  {cabinWon !== '' &&
                    typeof cabinWon.features !== undefined &&
                    cabinWon.features.soverom +
                      ' soverom / ' +
                      cabinWon.features.sengeplasser +
                      ' sengeplasser'}
                </p>
              </div>

              <div className="hytteinfo2-wrapper">
                <GiTakeMyMoney className="info-icon money-icon" />
                <div className="price-text2">
                  <p className="omhytta-text">
                    Utvask pris:{' '}
                    {cabinWon !== '' &&
                      typeof cabinWon.cleaningPrice !== undefined &&
                      cabinWon.cleaningPrice}
                    ,-
                  </p>
                  <p className="omhytta-text">
                    Pris for hytte:{' '}
                    {cabinWon !== '' &&
                      typeof cabinWon.price !== undefined &&
                      cabinWon.price}
                    ,-
                  </p>
                </div>

                {cabinWon !== '' &&
                typeof cabinWon.features !== undefined &&
                cabinWon.features.wifi ? (
                  <BsWifi className="info-icon internet-icon" />
                ) : (
                  <BsWifiOff className="info-icon internet-icon" />
                )}
                <p className="omhytta-text internet-text">
                  {cabinWon !== '' &&
                  typeof cabinWon.features !== undefined &&
                  cabinWon.features.wifi
                    ? 'Trådløst nett'
                    : 'Ikke trådløst nett'}
                </p>

                <MdShower className="info-icon bath-icon" />
                <p className="omhytta-text bath-text">
                  {cabinWon !== '' &&
                    typeof cabinWon.features !== undefined &&
                    cabinWon.features.bad + ' bad'}
                </p>
              </div>
            </div>
          </div>
          <button onClick={props.handleVisibility} className="btn small">
            Avbestill
          </button>
        </div>
        {props.visible && (
          <AlertPopup
            title="Avbestilling av tur"
            description="Er du sikker på at du vil avbestille turen? Hvis ja, trykk avbestill!"
            acceptMethod={props.cancelTrip}
            cancelMethod={props.handleVisibility}
            negativeAction="Avbryt"
            positiveAction="Avbestill"
          />
        )}
        {props.tooLateError && (
          <InfoPopup
            title="Avbestilling av tur"
            description="Du kan ikke avbestille en tur som har startdato innen 7 dager! Kontakt oss hvis du fortsatt vil avbestille."
            hideMethod={props.handleTooLateError}
            btnText="Ok"
          />
        )}
      </>
    );
  } else if (
    props.start <= Date.now() &&
    props.end >= Date.now() &&
    props.trip.winner
  ) {
    return (
      <>
        <BackButton name="Tilbake til mine turer" link="mineturer" />
        <HeroBanner name="Min tur" />
        <div className="mintur-container">
          <div className="titlepic-wrapper">
            <p className="mintur-title">{props.length + ' hytter tildelt'}</p>

            <select
              onChange={(e) => changeCabinInfo(e.target.value)}
              id="cabin-select"
              className="mintur-select"
            >
              {typeof props.cabinsWon !== undefined &&
                props.cabinsWon !== '' &&
                props.trip.cabinsWon.map((cabin) => {
                  return (
                    <option value={cabin.cabinName}>{cabin.cabinName}</option>
                  );
                })}
            </select>
            <img
              src={
                cabinWon !== '' && typeof cabinWon.pictures !== undefined
                  ? `${process.env.PUBLIC_URL}/assets/pictures/` +
                    cabinWon.pictures.mainPicture.filename
                  : `${process.env.PUBLIC_URL}/assets/pictures/MyTripPic.svg`
              }
              className="mintur-picture"
              alt="cabin"
            />
          </div>
          {!props.trip.feedback ? (
            <FeedbackForm data={props.trip} getTrip={props.getTrip} />
          ) : (
            <p className="feedback-info">
              Tilbakemelding sendt, hvis du vil kontakte oss send epost til
              hyttekommitteen@accenture.com
            </p>
          )}
          <div className="secondrow-wrapper">
            <div className="info-container">
              <p className="info-title">Reise informasjon</p>
              <div className="travelinfo-wrapper">
                <div className="checkin-info">
                  <p>Innsjekking</p>
                  <p>{props.getFormattedDate(props.start, false)}</p>
                  <p>17:00</p>
                </div>
                <div className="image-wrapper-mintur">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/icons/FlyingIcon.svg`}
                    alt="indicating travel"
                    className="travel-icon"
                  />
                </div>
                <div className="checkout-info">
                  <p>Utsjekking</p>
                  <p>{props.getFormattedDate(props.end, false)}</p>
                  <p>12:00</p>
                </div>
              </div>
            </div>
            <div className="checklist-container">
              <p className="checklist-title">Ta med</p>
              <div className="checklist">
                <div className="checklist-wrapper">
                  {cabinWon !== '' &&
                    typeof cabinWon.other !== undefined &&
                    cabinWon.other.huskeliste !== null &&
                    typeof cabinWon.other.huskeliste !== undefined &&
                    cabinWon.other.huskeliste.map((item, index) => {
                      return (
                        <p key={index} className="checklist-item">
                          {item}
                        </p>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
          <div className="omhytta-container">
            <p className="omhytta-title">Om hytta</p>
            <div className="hytteinfo-container">
              <div className="hytteinfo1-wrapper">
                <FaMapMarkerAlt className="info-icon marker-icon" />
                <div className="address-text">
                  <p className="omhytta-text">
                    {cabinWon !== '' &&
                      typeof cabinWon.address !== undefined &&
                      cabinWon.address + ','}
                  </p>
                  <p className="omhytta-text">Hemsedal</p>
                </div>

                <BiBed className="info-icon bed-icon" />
                <p className="omhytta-text bed-text">
                  {cabinWon !== '' &&
                    typeof cabinWon.features !== undefined &&
                    cabinWon.features.soverom +
                      ' soverom / ' +
                      cabinWon.features.sengeplasser +
                      ' sengeplasser'}
                </p>
              </div>

              <div className="hytteinfo2-wrapper">
                <GiTakeMyMoney className="info-icon money-icon" />
                <div className="price-text2">
                  <p className="omhytta-text">
                    Utvask pris:{' '}
                    {cabinWon !== '' &&
                      typeof cabinWon.cleaningPrice !== undefined &&
                      cabinWon.cleaningPrice}
                    ,-
                  </p>
                  <p className="omhytta-text">
                    Pris for hytte:{' '}
                    {cabinWon !== '' &&
                      typeof cabinWon.price !== undefined &&
                      cabinWon.price}
                    ,-
                  </p>
                </div>

                {cabinWon !== '' &&
                typeof cabinWon.features !== undefined &&
                cabinWon.features.wifi ? (
                  <BsWifi className="info-icon internet-icon" />
                ) : (
                  <BsWifiOff className="info-icon internet-icon" />
                )}
                <p className="omhytta-text internet-text">
                  {cabinWon !== '' &&
                  typeof cabinWon.features !== undefined &&
                  cabinWon.features.wifi
                    ? 'Trådløst nett'
                    : 'Ikke trådløst nett'}
                </p>

                <MdShower className="info-icon bath-icon" />
                <p className="omhytta-text bath-text">
                  {cabinWon !== '' &&
                    typeof cabinWon.features !== undefined &&
                    cabinWon.features.bad + ' bad'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else if (props.end < Date.now() && props.trip.winner) {
    return (
      <>
        <BackButton name="Tilbake til mine turer" link="mineturer" />
        <HeroBanner name="Min tur" />
        <div className="mintur-container">
          <div className="titlepic-wrapper">
            <p className="mintur-title">{props.length + ' hytter tildelt'}</p>
            <select
              onChange={(e) => changeCabinInfo(e.target.value)}
              id="cabin-select"
              className="mintur-select"
            >
              {typeof props.cabinsWon !== undefined &&
                props.cabinsWon !== '' &&
                props.trip.cabinsWon.map((cabin) => {
                  return (
                    <option value={cabin.cabinName}>{cabin.cabinName}</option>
                  );
                })}
            </select>
            <img
              src={
                cabinWon !== '' && typeof cabinWon.pictures !== undefined
                  ? `${process.env.PUBLIC_URL}/assets/pictures/` +
                    cabinWon.pictures.mainPicture.filename
                  : `${process.env.PUBLIC_URL}/assets/pictures/MyTripPic.svg`
              }
              className="mintur-picture"
              alt="cabin"
            />
          </div>
          {props.trip.winner && !props.trip.feedback && (
            <FeedbackForm data={props.trip} getTrip={props.getTrip} />
          )}
          <p className="pending-trip-text">
            {props.getFormattedDate(props.start, false)} -{' '}
            {props.getFormattedDate(props.end, false)}
          </p>
        </div>
      </>
    );
  } else {
    return <></>;
  }
};

export default MinTurFlere;
