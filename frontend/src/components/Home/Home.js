import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import BigButtonLink from '../01-Reusable/Buttons/BigButtonLink';
import HomeImage from '../01-Reusable/HomeImage/HomeImage';
import { FaRegUserCircle, FaQuestionCircle } from 'react-icons/fa';
import './Home.css';
import { useState, useEffect } from 'react';
<link
  href="https://use.fontawesome.com/releases/v5.7.0/css/all.css"
  rel="stylesheet"
/>;

const Home = () => {
  const [soknadOpen, setSoknadOpen] = useState(true);
  const [soknadEndDate, setsoknadEndDate] = useState('');

  useEffect(async () => {
    fetch('http://localhost:8080/season/getcurrentopen')
      .then((response) => response.json())
      .then((data) => {
        setSoknadOpen(data.isOpen);

        console.log(data.seasons[0].lastDay);
        let date;
        date = data.seasons[0].lastDay.replace('T00:00:00Z', '');
        const dates = date.split('-');
        setsoknadEndDate(dates[2] + '.' + dates[1] + '.' + dates[0]);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <HeroBanner />
      <div className="home-display">
        <div className="home-application">
          <h2 className="home-h2">Søknadsperiod er</h2>
          <h2 className="home-h2 soknad-open">
            {soknadOpen ? 'åpen' : 'stengt'}
          </h2>
          {soknadOpen ? (
            <BigButtonLink name="Søk på hytte" link="/soknad" />
          ) : (
            ''
          )}
          {soknadOpen ? (
            <p className="home-soknad-closes">
              Søknadsperioden stenger {soknadEndDate}
            </p>
          ) : (
            ''
          )}
        </div>
        <HomeImage
          imageLink="cabin-cosy.jpg"
          imageAlt="Something"
          buttonText="Vis hyttene"
        />
        <div className="home-buttons">
          <button className="btn big mine-turer">
            <FaRegUserCircle className="icon" />
            <p className="btn-text-home">Mine turer</p>
          </button>
          <button className="btn big faq">
            <FaQuestionCircle className="icon" />
            <p className="btn-text-home">FAQ</p>
          </button>
        </div>
        <HomeImage
          imageLink="mountain-dog.jpg"
          imageAlt="Something"
          buttonText="Utforsk Hemsedal"
        />
      </div>
    </>
  );
};

export default Home;
