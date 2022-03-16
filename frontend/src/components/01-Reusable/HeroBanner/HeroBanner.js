import './HeroBanner.css';

const HeroBanner = (props) => {
  return (
    <>
      <div className="hero">
        <div className="hero-container">
          <p className="hero-text">{props.name}</p>
          <img
            className="hero-picture"
            src={`${process.env.PUBLIC_URL}/assets/pictures/herobanner.jpg`}
            alt={props.name}
          />
        </div>
      </div>
    </>
  );
};

export default HeroBanner;
