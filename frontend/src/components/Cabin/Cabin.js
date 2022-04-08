import { useContext, useState, useEffect } from 'react';
import LoginContext from '../../LoginContext/login-context';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Cabin.css';

const Cabin = () => {
  const loginContext = useContext(LoginContext);
  const loggedIn = loginContext.loggedIn;

  const link = window.location.href;
  const pageID = link.split('/');

  useEffect(() => {
    async function getCabin(pageId) {
      console.log(pageId);
      fetch(`/cabin/${pageId}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => setCabinData(data))
        .catch((error) => console.log(error));
    }
    getCabin(pageID[pageID.length - 1]);
  }, []);

  const [cabinData, setCabinData] = useState({});
  console.log(cabinData);

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <HeroBanner name={cabinData.name} />
      <div className="cabin-display">
        <Slider {...settings}>
          {typeof cabinData !== null &&
            cabinData.pictures !== undefined &&
            cabinData.pictures.otherPictures.map((file) => {
              return (
                <div className="slick-slide-item">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/pictures/${file.filename}`}
                    alt={file.filename}
                  />
                </div>
              );
            })}
        </Slider>
      </div>
    </>
  );
};

export default Cabin;
