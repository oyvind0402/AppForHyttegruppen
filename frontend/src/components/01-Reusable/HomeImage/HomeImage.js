import { Link } from 'react-router-dom';
import './HomeImage.css';

const HomeImage = (props) => {
  return (
    <>
      <div className="home-picture-container">
        <img
          className="home-picture"
          src={`${process.env.PUBLIC_URL}/assets/pictures/${props.imageLink}`}
          alt={props.imageAlt}
        />
        <Link className="home-picture-btn link" to={props.link}>
          {props.buttonText}
        </Link>
      </div>
    </>
  );
};

export default HomeImage;
