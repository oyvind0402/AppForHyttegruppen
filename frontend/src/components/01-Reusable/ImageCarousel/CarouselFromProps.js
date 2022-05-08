import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Carousel.css';

const CarouselFromProps = (props) => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      {props.data !== null &&
        props.data !== undefined &&
        props.data.map((file, index) => {
          return (
            <div className="slick-slide-item" key={index}>
              <img src={URL.createObjectURL(file.image)} alt={file.name} />
            </div>
          );
        })}
    </Slider>
  );
};

export default CarouselFromProps;
