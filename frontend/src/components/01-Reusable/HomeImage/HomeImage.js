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
        <button className="home-picture-btn">{props.buttonText}</button>
      </div>
    </>
  );
};

export default HomeImage;
