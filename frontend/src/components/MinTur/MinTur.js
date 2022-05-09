import { useCallback, useEffect, useState } from 'react';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import { BsHourglassSplit } from 'react-icons/bs';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { BiBed } from 'react-icons/bi';
import { GiTakeMyMoney } from 'react-icons/gi';
import { BsWifiOff } from 'react-icons/bs';
import { BsWifi } from 'react-icons/bs';
import { MdShower } from 'react-icons/md';
import './MinTur.css';
import FeedbackForm from '../01-Reusable/FeedbackForm/FeedbackForm';
import { useHistory } from 'react-router-dom';
import AlertPopup from '../01-Reusable/PopUp/AlertPopup';
import BackButton from '../01-Reusable/Buttons/BackButton';
import InfoPopup from '../01-Reusable/PopUp/InfoPopup';
import MinTurFlere from './MinTurFlere';
import Cookies from 'universal-cookie';

const MinTur = () => {
  const history = useHistory();
  const link = window.location.href;
  const pageID = parseInt(link.split('/')[4]);
  const [trip, setTrip] = useState('');
  const [cabinsWon, setCabinsWon] = useState('');
  const [end, setEnd] = useState(new Date());
  const [start, setStart] = useState(new Date());
  const [visible, setVisible] = useState(false);
  const [tooLateError, setTooLateError] = useState(false);
  const [length, setLength] = useState(1);

  function getFormattedDate(date, pending) {
    if (pending) {
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

  const cookies = new Cookies();

  const cancelTrip = async () => {
    setVisible(false);
    const diffTime = Math.abs(Date.now() - new Date(trip.period.start));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) {
      setTooLateError(true);
      return;
    }

    const response = await fetch('/application/delete', {
      method: 'DELETE',
      body: JSON.stringify(pageID),
      headers: { token: cookies.get('refresh_token') },
    });

    if (response.ok) {
      fetch('/email/cancelledTrip', {
        method: 'POST',
        body: JSON.stringify({
          period: trip.period,
          cabinsWon: trip.cabinsWon,
          user: trip.user,
        }),
      })
        .then((response) => response.json())
        .catch((error) => console.log(error));
      history.goBack();
    }
  };

  const getTrip = useCallback(async () => {
    const response = await fetch('/application/' + pageID);

    const data = await response.json();
    if (response.ok) {
      setTrip(data);

      const start = new Date(data.period.start);
      const end = new Date(data.period.end);
      setEnd(end);
      setStart(start);

      let length = -1;

      if (data.winner) {
        length = data.cabinsWon.length;
        setLength(length);
      }

      let _cabinWinners = [];

      if (length > 0) {
        const response2 = await fetch('/cabin/' + data.cabinsWon[0].cabinName);
        const data2 = await response2.json();
        if (response2.ok) {
          _cabinWinners.push(data2);
          setCabinsWon(_cabinWinners);
        }
        if (length > 1) {
          const response3 = await fetch(
            '/cabin/' + data.cabinsWon[1].cabinName
          );
          const data3 = await response3.json();
          if (response3.ok) {
            _cabinWinners.push(data3);
            setCabinsWon(_cabinWinners);
          }
        }
        if (length > 2) {
          const response4 = await fetch(
            '/cabin/' + data.cabinsWon[2].cabinName
          );
          const data4 = await response4.json();
          if (response4.ok) {
            _cabinWinners.push(data4);
            setCabinsWon(_cabinWinners);
          }
        }
        if (length > 3) {
          const response5 = await fetch(
            '/cabin/' + data.cabinsWon[3].cabinName
          );
          const data5 = await response5.json();
          if (response5.ok) {
            _cabinWinners.push(data5);
            setCabinsWon(_cabinWinners);
          }
        }
      }
    } else {
      history.goBack();
    }
  }, [history, pageID]);

  useEffect(() => {
    if (trip === '') {
      getTrip();
    }
  }, [trip, getTrip]);

  if (length < 2) {
    if (start > Date.now() && trip.winner) {
      return (
        <>
          <BackButton name="Tilbake til mine turer" link="mineturer" />
          <HeroBanner name="Min tur" />
          <div className="mintur-container">
            <div className="titlepic-wrapper">
              <p className="mintur-title">
                {trip.cabinsWon.map((cabin) => {
                  return cabin.cabinName + ' ';
                })}
              </p>

              <img
                src={
                  cabinsWon !== '' && typeof cabinsWon[0].pictures !== undefined
                    ? `${process.env.PUBLIC_URL}/assets/pictures/` +
                      cabinsWon[0].pictures.mainPicture.filename
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
                    <p>{getFormattedDate(start, false)}</p>
                    <p>17:00</p>
                  </div>
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/icons/FlyingIcon.svg`}
                    alt="indicating travel"
                    className="travel-icon"
                  />
                  <div className="checkout-info">
                    <p>Utsjekking</p>
                    <p>{getFormattedDate(end, false)}</p>
                    <p>12:00</p>
                  </div>
                </div>
              </div>
              <div className="checklist-container">
                <p className="checklist-title">Ta med</p>
                <div className="checklist">
                  <div className="checklist-wrapper">
                    {cabinsWon !== '' &&
                      typeof cabinsWon[0].other !== undefined &&
                      cabinsWon[0].other.huskeliste !== null &&
                      typeof cabinsWon[0].other.huskeliste !== undefined &&
                      cabinsWon[0].other.huskeliste.map((item, index) => {
                        if (index < 3) {
                          return <p className="checklist-item">{item}</p>;
                        } else {
                          return null;
                        }
                      })}
                  </div>

                  <div className="checklist-wrapper">
                    {cabinsWon !== '' &&
                      typeof cabinsWon[0].other !== undefined &&
                      cabinsWon[0].other.huskeliste !== null &&
                      typeof cabinsWon[0].other.huskeliste !== undefined &&
                      cabinsWon[0].other.huskeliste.map((item, index) => {
                        if (index >= 3) {
                          return <p className="checklist-item">{item}</p>;
                        } else {
                          return null;
                        }
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
                      {cabinsWon !== '' &&
                        typeof cabinsWon[0].address !== undefined &&
                        cabinsWon[0].address + ','}
                    </p>
                    <p className="omhytta-text">Hemsedal</p>
                  </div>

                  <BiBed className="info-icon bed-icon" />
                  <p className="omhytta-text bed-text">
                    {cabinsWon !== '' &&
                      typeof cabinsWon[0].features !== undefined &&
                      cabinsWon[0].features.soverom +
                        ' soverom / ' +
                        cabinsWon[0].features.sengeplasser +
                        ' sengeplasser'}
                  </p>
                </div>

                <div className="hytteinfo2-wrapper">
                  <GiTakeMyMoney className="info-icon money-icon" />
                  <div className="price-text">
                    <p className="omhytta-text">
                      Utvask pris:{' '}
                      {cabinsWon !== '' &&
                        typeof cabinsWon[0].cleaningPrice !== undefined &&
                        cabinsWon[0].cleaningPrice}
                      ,-
                    </p>
                    <p className="omhytta-text">
                      Pris for hytte:{' '}
                      {cabinsWon !== '' &&
                        typeof cabinsWon[0].price !== undefined &&
                        cabinsWon[0].price}
                      ,-
                    </p>
                  </div>

                  {cabinsWon !== '' &&
                  typeof cabinsWon[0].features !== undefined &&
                  cabinsWon[0].features.wifi ? (
                    <BsWifi className="info-icon internet-icon" />
                  ) : (
                    <BsWifiOff className="info-icon internet-icon" />
                  )}
                  <p className="omhytta-text internet-text">
                    {cabinsWon !== '' &&
                    typeof cabinsWon[0].features !== undefined &&
                    cabinsWon[0].features.wifi
                      ? 'Trådløst nett'
                      : 'Ikke trådløst nett'}
                  </p>

                  <MdShower className="info-icon bath-icon" />
                  <p className="omhytta-text bath-text">
                    {cabinsWon !== '' &&
                      typeof cabinsWon[0].features !== undefined &&
                      cabinsWon[0].features.bad + ' bad'}
                  </p>
                </div>
              </div>
            </div>
            <button onClick={handleVisibility} className="btn small">
              Avbestill
            </button>
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
    } else if (start > Date.now() && !trip.winner) {
      return (
        <>
          <BackButton name="Tilbake til mine turer" link="mineturer" />
          <HeroBanner name="Min tur" />
          <div className="mintur-container">
            <div className="titlepic-wrapper">
              <p className="mintur-title">Venter på godkjenning</p>
              <img
                src={`${process.env.PUBLIC_URL}/assets/pictures/MyTripPic.svg`}
                className="mintur-picture2"
                alt="cabin"
              />
            </div>
            <div className="pending-trip-container">
              <p className="pending-trip-text">Svar forventes</p>
            </div>
            <div className="calendar-container">
              <BsHourglassSplit className="pending-trip-icon" />
              <p>{getFormattedDate(start, true)}</p>
            </div>
            <div className="pending-trip-container">
              <p className="pending-trip-text pending-applied">Søkt på:</p>
              {trip.cabins.map((cabin) => (
                <p className="pending-applied-cabin" key={cabin.cabinName}>
                  {cabin.cabinName}
                </p>
              ))}
            </div>

            <button onClick={handleVisibility} className="btn small">
              Avbestill
            </button>
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
    } else if (start <= Date.now() && end >= Date.now() && trip.winner) {
      return (
        <>
          <BackButton name="Tilbake til mine turer" link="mineturer" />
          <HeroBanner name="Min tur" />
          <div className="mintur-container">
            <div className="titlepic-wrapper">
              <p className="mintur-title">
                {trip.cabinsWon.map((cabin) => {
                  return cabin.cabinName + ' ';
                })}
              </p>
              <img
                src={
                  cabinsWon !== '' && typeof cabinsWon[0].pictures !== undefined
                    ? `${process.env.PUBLIC_URL}/assets/pictures/` +
                      cabinsWon[0].pictures.mainPicture.filename
                    : `${process.env.PUBLIC_URL}/assets/pictures/MyTripPic.svg`
                }
                className="mintur-picture"
                alt="cabin"
              />
            </div>
            {!trip.feedback ? (
              <FeedbackForm data={trip} getTrip={getTrip} />
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
                    <p>{getFormattedDate(start, false)}</p>
                    <p>17:00</p>
                  </div>
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/icons/FlyingIcon.svg`}
                    alt="indicating travel"
                    className="travel-icon"
                  />
                  <div className="checkout-info">
                    <p>Utsjekking</p>
                    <p>{getFormattedDate(end, false)}</p>
                    <p>12:00</p>
                  </div>
                </div>
              </div>
              <div className="checklist-container">
                <p className="checklist-title">Ta med</p>
                <div className="checklist">
                  <div className="checklist-wrapper">
                    {cabinsWon !== '' &&
                      typeof cabinsWon[0].other !== undefined &&
                      cabinsWon[0].other.huskeliste !== null &&
                      typeof cabinsWon[0].other.huskeliste !== undefined &&
                      cabinsWon[0].other.huskeliste.map((item, index) => {
                        if (index < 3) {
                          return <p className="checklist-item">{item}</p>;
                        } else {
                          return null;
                        }
                      })}
                  </div>

                  <div className="checklist-wrapper">
                    {cabinsWon !== '' &&
                      typeof cabinsWon[0].other !== undefined &&
                      cabinsWon[0].other.huskeliste !== null &&
                      typeof cabinsWon[0].other.huskeliste !== undefined &&
                      cabinsWon[0].other.huskeliste.map((item, index) => {
                        if (index >= 3) {
                          return <p className="checklist-item">{item}</p>;
                        } else {
                          return null;
                        }
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
                      {cabinsWon !== '' &&
                        typeof cabinsWon[0].address !== undefined &&
                        cabinsWon[0].address + ','}
                    </p>
                    <p className="omhytta-text">Hemsedal</p>
                  </div>

                  <BiBed className="info-icon bed-icon" />
                  <p className="omhytta-text bed-text">
                    {cabinsWon !== '' &&
                      typeof cabinsWon[0].features !== undefined &&
                      cabinsWon[0].features.soverom +
                        ' soverom / ' +
                        cabinsWon[0].features.sengeplasser +
                        ' sengeplasser'}
                  </p>
                </div>

                <div className="hytteinfo2-wrapper">
                  <GiTakeMyMoney className="info-icon money-icon" />
                  <div className="price-text">
                    <p className="omhytta-text">
                      Utvask pris:{' '}
                      {cabinsWon !== '' &&
                        typeof cabinsWon[0].cleaningPrice !== undefined &&
                        cabinsWon[0].cleaningPrice}
                      ,-
                    </p>
                    <p className="omhytta-text">
                      Pris for hytte:{' '}
                      {cabinsWon !== '' &&
                        typeof cabinsWon[0].price !== undefined &&
                        cabinsWon[0].price}
                      ,-
                    </p>
                  </div>

                  {cabinsWon !== '' &&
                  typeof cabinsWon[0].features !== undefined &&
                  cabinsWon[0].features.wifi ? (
                    <BsWifi className="info-icon internet-icon" />
                  ) : (
                    <BsWifiOff className="info-icon internet-icon" />
                  )}
                  <p className="omhytta-text internet-text">
                    {cabinsWon !== '' &&
                    typeof cabinsWon[0].features !== undefined &&
                    cabinsWon[0].features.wifi
                      ? 'Trådløst nett'
                      : 'Ikke trådløst nett'}
                  </p>

                  <MdShower className="info-icon bath-icon" />
                  <p className="omhytta-text bath-text">
                    {cabinsWon !== '' &&
                      typeof cabinsWon[0].features !== undefined &&
                      cabinsWon[0].features.bad + ' bad'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else if (end < Date.now() && trip.winner) {
      return (
        <>
          <BackButton name="Tilbake til mine turer" link="mineturer" />
          <HeroBanner name="Min tur" />
          <div className="mintur-container">
            <div className="titlepic-wrapper">
              <p className="mintur-title">{trip.cabins[0].cabinName}</p>
              <img
                src={
                  cabinsWon !== '' && typeof cabinsWon[0].pictures !== undefined
                    ? `${process.env.PUBLIC_URL}/assets/pictures/` +
                      cabinsWon[0].pictures.mainPicture.filename
                    : `${process.env.PUBLIC_URL}/assets/pictures/MyTripPic.svg`
                }
                className="mintur-picture"
                alt="cabin"
              />
            </div>
            {trip.winner && !trip.feedback && (
              <FeedbackForm data={trip} getTrip={getTrip} />
            )}
            <p className="pending-trip-text">
              {getFormattedDate(start, false)} - {getFormattedDate(end, false)}
            </p>
          </div>
        </>
      );
    } else {
      return <></>;
    }
  } else {
    return (
      <>
        {trip !== '' && cabinsWon !== '' && (
          <MinTurFlere
            trip={trip}
            cabinsWon={cabinsWon}
            tooLateError={tooLateError}
            handleTooLateError={handleTooLateError}
            handleVisibility={handleVisibility}
            visible={visible}
            end={end}
            start={start}
            cancelTrip={cancelTrip}
            getFormattedDate={getFormattedDate}
            length={length}
            getTrip={getTrip}
          />
        )}
      </>
    );
  }
};

export default MinTur;
