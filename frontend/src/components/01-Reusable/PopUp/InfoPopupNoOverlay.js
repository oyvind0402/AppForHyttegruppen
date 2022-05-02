import './PopUp.css';

const InfoPopupNoBG = (props) => {
  return (
    <>
      <div className="alert-popup-container">
        <p className="alert-popup-title">{props.title}</p>
        <p className="alert-popup-desc"> {props.description}</p>
        <div className="alert-popup-buttons">
          <button onClick={props.hideMethod} className="btn-smaller">
            {props.btnText}
          </button>
        </div>
      </div>
    </>
  );
};

export default InfoPopupNoBG;
