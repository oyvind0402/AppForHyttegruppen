import { useEffect, useState } from 'react';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import { BsFillKeyFill, BsHourglassSplit } from 'react-icons/bs';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { AiFillCar } from 'react-icons/ai';
import { BiWalk } from 'react-icons/bi';
import { BiBed } from 'react-icons/bi';
import { GiTakeMyMoney } from 'react-icons/gi';
import { BsWifiOff } from 'react-icons/bs';
import { Md4GMobiledata } from 'react-icons/md';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { MdShower } from 'react-icons/md';
import './MinTur.css';
import FeedbackForm from '../01-Reusable/FeedbackForm/FeedbackForm';
import { useHistory } from 'react-router-dom';
import AlertPopup from '../01-Reusable/PopUp/AlertPopup';

const MinTur = () => {
  const history = useHistory();
  const link = window.location.href;
  const pageID = parseInt(link.split('/')[4]);
  const [trip, setTrip] = useState({});

  const [future, setFuture] = useState(false);
  const [pending, setPending] = useState(false);
  const [current, setCurrent] = useState(false);
  const [former, setFormer] = useState(false);
  const [end, setEnd] = useState(new Date());
  const [start, setStart] = useState(new Date());
  const [visible, setVisible] = useState(false);

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

  async function getTrip() {
    const response = await fetch('/application/' + pageID);

    const data = await response.json();
    if (response.ok) {
      setTrip(data);

      const start = new Date(data.period.start);
      const end = new Date(data.period.end);
      setEnd(end);
      setStart(start);

      if (start > Date.now() && !data.winner) {
        setPending(true);
        setFuture(false);
        setCurrent(false);
        setFormer(false);
      } else if (start < Date.now() && end > Date.now() && data.winner) {
        setCurrent(true);
        setFuture(false);
        setPending(false);
        setFormer(false);
      } else if (end < Date.now() && data.winner) {
        setFormer(true);
        setCurrent(false);
        setPending(false);
        setFuture(false);
      } else if (start > Date.now() && data.winner) {
        setFuture(true);
        setCurrent(false);
        setPending(false);
        setFormer(false);
      }
    } else {
      history.goBack();
    }
  }

  const handleVisibility = () => {
    setVisible(!visible);
  };

  const cancelTrip = async () => {
    setVisible(false);
    const response = await fetch('/application/delete', {
      method: 'DELETE',
      body: JSON.stringify(pageID),
      headers: { token: localStorage.getItem('refresh_token') },
    });

    const data = await response.json();
    if (response.ok) {
      console.log(data);
      history.goBack();
    }
  };

  useEffect(() => {
    getTrip();
  }, []);

  if (future && trip.winner) {
    return (
      <>
        <HeroBanner name="Min tur" />
        <div className="mintur-container">
          <div className="titlepic-wrapper">
            <p className="mintur-title">{trip.cabins[0].cabinName}</p>

            <img
              src={`${process.env.PUBLIC_URL}/assets/pictures/MyTripPic.svg`}
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
                  <p className="checklist-item">Håndklær</p>
                  <p className="checklist-item">Stearinlys</p>
                  <p className="checklist-item">Tørkerull</p>
                </div>
                <div className="checklist-wrapper">
                  <p className="checklist-item">Sovepose eller sengetøy</p>
                  <p className="checklist-item">Tørkehåndkle/oppvaskklut</p>
                  <p className="checklist-item">Toalettpapir</p>
                </div>
              </div>
            </div>
          </div>
          <div className="omhytta-container">
            <p className="omhytta-title">Om hytta</p>
            <div className="hytteinfo-container">
              <div className="hytteinfo1-wrapper">
                <BsFillKeyFill className="info-icon key-icon" />
                <div className="key-text">
                  <p className="omhytta-text">Nøkkel i en nøkkelboks</p>
                  <p className="omhytta-text">Koden til boksen via epost</p>
                </div>

                <FaMapMarkerAlt className="info-icon marker-icon" />
                <div className="address-text">
                  <p className="omhytta-text">Tunvegen 11,</p>
                  <p className="omhytta-text">Hemsedal</p>
                </div>

                <AiFillCar className="info-icon car-icon" />
                <div className="roaddesc-text">
                  <p className="omhytta-text">Bilvei helt frem</p>
                  <p>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      className="omhytta-text roaddesc-link"
                      href="https://www.google.com/maps/dir/Oslo+gate+7,+Oslo/3560+Hemsedal/@59.9260916,10.695873,11z/data=!4m14!4m13!1m5!1m1!1s0x46416ef682dc4cd5:0x515b4a96821c140f!2m2!1d10.7677413!2d59.9069394!1m5!1m1!1s0x463fe896e25bc07b:0xfdd68f22ff1ebba0!2m2!1d8.552376!2d60.8630648!3e0"
                    >
                      Veibeskrivelse
                    </a>
                  </p>
                </div>
                <BiWalk className="info-icon walking-icon" />
                <p className="omhytta-text walking-text">10 min til sentrum</p>

                <BiBed className="info-icon bed-icon" />
                <p className="omhytta-text bed-text">
                  5 soverom / 10 sengeplasser
                </p>
              </div>

              <div className="hytteinfo2-wrapper">
                <GiTakeMyMoney className="info-icon money-icon" />
                <div className="price-text">
                  <p className="omhytta-text">Utvask pris: 1200,-</p>
                  <p className="omhytta-text">Pris for hytte: 1200,-</p>
                </div>

                <BsWifiOff className="info-icon internet-icon" />
                <p className="omhytta-text internet-text">Ikke trådløst nett</p>

                <Md4GMobiledata className="info-icon 4g-icon" />
                <p className="omhytta-text 4g-text">God 4G-dekning</p>

                <AiOutlineArrowUp className="info-icon arrow-icon" />
                <div className="arrow-text">
                  <p className="omhytta-text">Modernisert i 2004</p>
                  <p className="omhytta-text">Høy standard</p>
                </div>

                <MdShower className="info-icon bath-icon" />
                <p className="omhytta-text bath-text">2 bad</p>
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
      </>
    );
  } else if (pending && !trip.winner) {
    return (
      <>
        <HeroBanner name="Min tur" />
        <div className="mintur-container">
          <div className="titlepic-wrapper">
            <p className="mintur-title">Venter på godkjenning</p>
            <img
              src={`${process.env.PUBLIC_URL}/assets/pictures/MyTripPic.svg`}
              className="mintur-picture"
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
  } else if (current && trip.winner) {
    return (
      <>
        <HeroBanner name="Min tur" />
        <div className="mintur-container">
          <div className="titlepic-wrapper">
            <p className="mintur-title">{trip.cabins[0].cabinName}</p>
            <img
              src={`${process.env.PUBLIC_URL}/assets/pictures/MyTripPic.svg`}
              className="mintur-picture"
              alt="cabin"
            />
          </div>
          <FeedbackForm />
          <div className="secondrow-wrapper">
            <div className="info-container">
              <p className="info-title">Reise informasjon</p>
              <div className="travelinfo-wrapper">
                <div className="checkin-info">
                  <p className="checkin-text">Innsjekking</p>
                  <p>{getFormattedDate(start, false)}</p>
                  <p>17:00</p>
                </div>
                <div>
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/icons/FlyingIcon.svg`}
                    alt="indicating travel"
                    className="travel-icon"
                  />
                </div>

                <div className="checkout-info">
                  <p className="checkin-text">Utsjekking</p>
                  <p>{getFormattedDate(end, false)}</p>
                  <p>12:00</p>
                </div>
              </div>
            </div>
            <div className="checklist-container">
              <p className="checklist-title">Ta med</p>
              <div className="checklist">
                <div className="checklist-wrapper">
                  <p className="checklist-item">Håndklær</p>
                  <p className="checklist-item">Stearinlys</p>
                  <p className="checklist-item">Tørkerull</p>
                </div>
                <div className="checklist-wrapper">
                  <p className="checklist-item">Sovepose eller sengetøy</p>
                  <p className="checklist-item">Tørkehåndkle/oppvaskklut</p>
                  <p className="checklist-item">Toalettpapir</p>
                </div>
              </div>
            </div>
          </div>
          <div className="omhytta-container">
            <p className="omhytta-title">Om hytta</p>
            <div className="hytteinfo-container">
              <div className="hytteinfo1-wrapper">
                <BsFillKeyFill className="info-icon key-icon" />
                <div className="key-text">
                  <p className="omhytta-text">Nøkkel i en nøkkelboks</p>
                  <p className="omhytta-text">Koden til boksen via epost</p>
                </div>

                <FaMapMarkerAlt className="info-icon marker-icon" />
                <div className="address-text">
                  <p className="omhytta-text">Tunvegen 11,</p>
                  <p className="omhytta-text">Hemsedal</p>
                </div>

                <AiFillCar className="info-icon car-icon" />
                <div className="roaddesc-text">
                  <p className="omhytta-text">Bilvei helt frem</p>
                  <p>
                    <a
                      target="_blank"
                      className="omhytta-text roaddesc-link"
                      href="https://www.google.com/maps/dir/Oslo+gate+7,+Oslo/3560+Hemsedal/@59.9260916,10.695873,11z/data=!4m14!4m13!1m5!1m1!1s0x46416ef682dc4cd5:0x515b4a96821c140f!2m2!1d10.7677413!2d59.9069394!1m5!1m1!1s0x463fe896e25bc07b:0xfdd68f22ff1ebba0!2m2!1d8.552376!2d60.8630648!3e0"
                    >
                      Veibeskrivelse
                    </a>
                  </p>
                </div>
                <BiWalk className="info-icon walking-icon" />
                <p className="omhytta-text walking-text">10 min til sentrum</p>

                <BiBed className="info-icon bed-icon" />
                <p className="omhytta-text bed-text">
                  5 soverom / 10 sengeplasser
                </p>
              </div>

              <div className="hytteinfo2-wrapper">
                <GiTakeMyMoney className="info-icon money-icon" />
                <div className="price-text">
                  <p className="omhytta-text">Utvask pris: 1200,-</p>
                  <p className="omhytta-text">Pris for hytte: 1200,-</p>
                </div>

                <BsWifiOff className="info-icon internet-icon" />
                <p className="omhytta-text internet-text">Ikke trådløst nett</p>

                <Md4GMobiledata className="info-icon 4g-icon" />
                <p className="omhytta-text 4g-text">God 4G-dekning</p>

                <AiOutlineArrowUp className="info-icon arrow-icon" />
                <div className="arrow-text">
                  <p className="omhytta-text">Modernisert i 2004</p>
                  <p className="omhytta-text">Høy standard</p>
                </div>

                <MdShower className="info-icon bath-icon" />
                <p className="omhytta-text bath-text">2 bad</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else if (former && trip.winner) {
    return (
      <>
        <HeroBanner name="Min tur" />
        <div className="mintur-container">
          <div className="titlepic-wrapper">
            <p className="mintur-title">{trip.cabins[0].cabinName}</p>
            <img
              src={`${process.env.PUBLIC_URL}/assets/pictures/MyTripPic.svg`}
              className="mintur-picture"
              alt="cabin"
            />
          </div>
          {/**Må legge til en funksjonalitet for å se om brukeren har sendt inn feedback eller ikke */}
          {!trip.winner && <FeedbackForm />}
          <p className="pending-trip-text">
            {getFormattedDate(start, false)} - {getFormattedDate(end, false)}
          </p>
        </div>
      </>
    );
  } else {
    return <></>;
  }
};

export default MinTur;
