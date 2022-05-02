import './PopUp.css';

const AlertPopup = (props) => {
  return (
    <>
      <div className="alert-popup-container">
        <p className="alert-popup-title">{props.title}</p>
        <p className="alert-popup-desc"> {props.description}</p>
        <hr />
        <div className="alert-popup-buttons">
          <button onClick={props.cancelMethod} className="btn-smaller">
            {props.negativeAction}
          </button>
          <button onClick={props.acceptMethod} className="btn-smaller">
            {props.positiveAction}
          </button>
        </div>
      </div>
      <div className="popUp-overlay"></div>
    </>
  );
};

export default AlertPopup;
