import './HeroBanner.css';

const AdminBanner = (props) => {
  return (
    <>
      <div className="hero">
        <div className="hero-container">
          <h1 className="admin-hero-text">{props.name}</h1>
          <img
            className="admin-hero-picture"
            src={`${process.env.PUBLIC_URL}/assets/pictures/TripHistory.svg`}
            alt={props.name}
          />
        </div>
      </div>
    </>
  );
};

export default AdminBanner;
