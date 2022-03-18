import { useContext, useEffect, useState } from 'react';
import LoginContext from '../../LoginContext/login-context';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import { BsFillKeyFill } from 'react-icons/bs';
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

const MinTur = () => {
  const loginContext = useContext(LoginContext);

  const loggedIn = loginContext.loggedIn;

  const link = window.location.href;

  const pageID = link.split('/')[4];

  //This is just here for now, before we have api calls
  //where we would fetch the cabin application with ID = pageID
  const index = pageID - 1;

  const [approved, setApproved] = useState(false);
  const [pending, setPending] = useState(false);

  const data = {
    applications: [
      {
        id: 1,
        cabinName: 'Utsikten',
        season: 'Uke 52',
        date: '27.12.2022',
        endDate: '01.01.2023',
        approved: 'approved',
        active: false,
        picture: `${process.env.PUBLIC_URL}/assets/pictures/MyTripPic.svg`,
      },
      {
        id: 2,
        cabinName: 'Knausen',
        season: 'Uke 12',
        date: '12.04.2023',
        endDate: '19.04.2023',
        approved: 'pending',
        active: false,
        picture: `${process.env.PUBLIC_URL}/assets/pictures/MyTripPic.svg`,
      },
      {
        id: 3,
        cabinName: 'Fanitullen',
        season: 'Uke 2',
        date: '14.01.2023',
        endDate: '21.01.2023',
        approved: 'approved',
        active: true,
        picture: `${process.env.PUBLIC_URL}/assets/pictures/MyTripPic.svg`,
      },
      {
        id: 4,
        cabinName: 'Store Grøndalen',
        season: 'Uke 13',
        date: '19.04.2023',
        endDate: '26.04.2023',
        approved: 'pending',
        active: false,
        picture: `${process.env.PUBLIC_URL}/assets/pictures/MyTripPic.svg`,
      },
    ],
  };

  useEffect(() => {
    if (data.applications[index].approved == 'approved') {
      setApproved(true);
      setPending(false);
    }
    if (data.applications[index].approved == 'pending') {
      setPending(true);
      setApproved(false);
    }
  }, []);

  return (
    <>
      <HeroBanner name="Min tur" />
      <div className="mintur-container">
        <div className="titlepic-wrapper">
          <p className="mintur-title">{data.applications[index].cabinName}</p>
          <img
            src={data.applications[index].picture}
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
                <p>{data.applications[index].date}</p>
                <p>17:00</p>
              </div>
              <img
                src={`${process.env.PUBLIC_URL}/assets/icons/FlyingIcon.svg`}
                alt="picture indicating travel"
                className="travel-icon"
              />
              <div className="checkout-info">
                <p>Utsjekking</p>
                <p>{data.applications[index].endDate}</p>
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
};

export default MinTur;
