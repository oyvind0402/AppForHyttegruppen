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
        <Link className="link" to={props.link}>
          <button className="home-picture-btn">{props.buttonText}</button>{' '}
        </Link>
      </div>
    </>
  );
};

export default HomeImage;
