import { useEffect, useState } from 'react';
import './PopUp.css';

const PopupApplication = (props) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) {
      document.getElementById('popup').style.display = 'none';
      window.location.href = '/mineturer';
    }
  }, [visible]);

  let contentPopup;
  if (props.periodArray.length < 5) {
    contentPopup = props.periodArray.map((pickedPeriod, index) => {
      return <p key={index}>{pickedPeriod.name}</p>;
    });
  } else {
    let textContentPopup = '';

    for (let i = 0; i < props.periodArray.length; i++) {
      console.log(props.periodArray[i]);
      textContentPopup += props.periodArray[i].name + ', ';
      if ((i + 1) % 5 === 0) {
        textContentPopup += '\n';
      }
    }
    let newTextContentPopup = textContentPopup.substring(
      0,
      textContentPopup.length - 2
    );
    contentPopup = <p>{newTextContentPopup}</p>;
  }

  const closePopUp = () => {
    setVisible(false);
  };

  return (
    <>
      <div className="popup" id="popup">
        <div className="popUp-overlay"></div>
        <div className="popup-content">
          <p>Følgende periode(r) ble registrert:</p>
          {contentPopup}
          <button className="btn small popupBtn" onClick={closePopUp}>
            Ok
          </button>
        </div>
      </div>
    </>
  );
};

export default PopupApplication;
