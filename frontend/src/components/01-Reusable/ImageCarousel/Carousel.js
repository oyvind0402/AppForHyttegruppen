import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Carousel.css';

const Carousel = (props) => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      {props.cabinData !== null &&
        props.cabinData.pictures !== undefined &&
        props.cabinData.pictures.otherPictures.map((file) => {
          return (
            <div className="slick-slide-item" key={file.filename}>
              <img
                src={`${process.env.PUBLIC_URL}/assets/pictures/${file.filename}`}
                alt={file.filename}
              />
            </div>
          );
        })}
    </Slider>
  );
};

export default Carousel;
