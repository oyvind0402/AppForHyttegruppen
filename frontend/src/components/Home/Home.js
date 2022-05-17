import HeroBannerHome from '../01-Reusable/HeroBanner/HeroBannerHome';
import BigButtonLink from '../01-Reusable/Buttons/BigButtonLink';
import HomeImage from '../01-Reusable/HomeImage/HomeImage';
import { FaRegUserCircle, FaQuestionCircle } from 'react-icons/fa';
import './Home.css';
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import LoginContext from '../../LoginContext/login-context';

const Home = () => {
  const [soknadOpen, setSoknadOpen] = useState(false);
  const [soknadEndDate, setsoknadEndDate] = useState('');
  const loginContext = useContext(LoginContext);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/season/open');
        const data = await response.json();
        if (response.ok) {
          setSoknadOpen(data.isOpen);
          if (data.isOpen) {
            let date;
            date = data.seasons[0].applyUntil.replace('T00:00:00Z', '');
            const dates = date.split('-');
            setsoknadEndDate(dates[2] + '.' + dates[1] + '.' + dates[0]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <HeroBannerHome />
      <div className="home-display">
        <div className="home-application">
          <h2 className="home-h2">Søknadsperioden er</h2>
          <h2 className="home-h2 soknad-open">
            {soknadOpen ? 'åpen' : 'stengt'}
          </h2>
          {soknadOpen && loginContext.loggedIn ? (
            <BigButtonLink name="Søk på hytte" link="/soknad" />
          ) : (
            ''
          )}
          {!soknadOpen && loginContext.adminAccess ? (
            <BigButtonLink
              name="Åpne søknadsperiode"
              link="/admin/startsoknad"
            />
          ) : null}
          {soknadOpen && !loginContext.loggedIn ? (
            <BigButtonLink name="Logg inn" link="/login" />
          ) : null}
          {soknadOpen && loginContext.loggedIn ? (
            <p className="home-soknad-closes">
              Søknadsperioden stenger {soknadEndDate}
            </p>
          ) : (
            ''
          )}
          {soknadOpen && !loginContext.loggedIn ? (
            <p className="home-soknad-closes">
              Søknadsperioden stenger {soknadEndDate}
              <br />
              Logg inn for å søke på hytter!
            </p>
          ) : (
            ''
          )}
        </div>
        <HomeImage
          imageLink="cabin-cosy.jpg"
          imageAlt="Cosy by the fire cabin picture"
          buttonText="Vis hyttene"
          link="/hytter"
        />
        <div className="home-buttons">
          <Link className="btn-link btn big mine-turer" to="/mineturer">
            <FaRegUserCircle className="icon" aria-label="User Icon" />
            <p className="btn-text-home">Mine turer</p>
          </Link>
          <Link className="btn-link btn big mine-turer" to="/faq">
            <FaQuestionCircle className="icon" aria-label="FAQ Icon" />
            <p className="btn-text-home">FAQ</p>
          </Link>
        </div>
        <HomeImage
          imageLink="mountain-dog.jpg"
          imageAlt="Mountain tur with dog"
          buttonText="Utforsk Hemsedal"
          link="/hytteomraade"
        />
      </div>
    </>
  );
};

export default Home;
