import { useEffect, useState } from 'react';
import './PopUp.css';

const PopupApplication = (props) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) {
      document.getElementById('popup').style.display = 'none';
      window.location.href = '/';
    }
  }, [visible]);

  const closePopUp = () => {
    setVisible(false);
  };

  return (
    <>
      <div className="popup" id="popup">
        <div className="popUp-overlay"></div>
        <div className="popup-content">
          <p>Følgende periode er registrert:</p>
          {props.periodArray.map((pickedPeriod, index) => {
            return <p key={index}>{pickedPeriod.name}</p>;
          })}
          <button className="btn small popupBtn" onClick={closePopUp}>
            Ok
          </button>
        </div>
      </div>
    </>
  );
};

export default PopupApplication;
