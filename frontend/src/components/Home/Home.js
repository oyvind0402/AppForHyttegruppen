import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import BigButtonLink from '../01-Reusable/Buttons/BigButtonLink';
import HomeImage from '../01-Reusable/HomeImage/HomeImage';
import { FaRegUserCircle, FaQuestionCircle } from 'react-icons/fa';
import './Home.css';
<link
  href="https://use.fontawesome.com/releases/v5.7.0/css/all.css"
  rel="stylesheet"
/>;

const Home = () => {
  return (
    <>
      <HeroBanner />
      <div className="home-display">
        <div>
          <h2>Søknadsperiod er ÅPEN</h2>
          <BigButtonLink name="Søk på hytte" link="/soknad" />
          <p>Søknadsperioden stenger 12.13.2023</p>
        </div>
        <HomeImage
          imageLink="cabin-cosy.jpg"
          imageAlt="Something"
          buttonText="Vis hyttene"
        />
        <div className="home-buttons">
          <button className="btn big mine-turer">
            <FaRegUserCircle className="icon" />
            Mine turer
          </button>
          <button className="btn big faq">
            <FaQuestionCircle className="icon" />
            Mine turer
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
