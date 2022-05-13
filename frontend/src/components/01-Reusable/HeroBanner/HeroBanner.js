import './HeroBanner.css';

const HeroBanner = (props) => {
  return (
    <>
      <div className="hero">
        <h1 className="hero-text">{props.name}</h1>
        <div className="hero-container">
          <img
            className="hero-picture"
            src={`${process.env.PUBLIC_URL}/assets/pictures/herobanner.jpg`}
            alt=""
            aria-label="Hero Banner"
          />
        </div>
      </div>
    </>
  );
};

export default HeroBanner;
