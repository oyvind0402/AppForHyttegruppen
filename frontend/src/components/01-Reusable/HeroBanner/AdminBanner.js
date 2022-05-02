import './HeroBanner.css';

const AdminBanner = (props) => {
  return (
    <>
      <div className="hero">
        <div className="hero-container">
          <p className="admin-hero-text">{props.name}</p>
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
