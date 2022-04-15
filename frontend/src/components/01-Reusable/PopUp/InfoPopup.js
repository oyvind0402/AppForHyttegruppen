import './PopUp.css';

const InfoPopup = (props) => {
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
      <div className="popUp-overlay"></div>
    </>
  );
};

export default InfoPopup;
