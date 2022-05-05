import { useEffect, useState } from 'react';
import Address from './Address';
import './TabTextAndAddress.css';

const TabTextAndAddress = (props) => {
  const [winWidth, setWinWidth] = useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener('resize', () => setWinWidth(window.innerWidth));
  }, []);

  return winWidth > 800 ? (
    <div className="infowrapper">
      <p>
        {props.chosenText !== undefined &&
        props.chosenText !== '' &&
        props.chosenText !== null
          ? props.chosenText
          : 'Informasjon er dessverre ikke tilgjengelig.'}
      </p>
      <Address cabin={props.cabinData} />
    </div>
  ) : (
    <div className="infowrapper">
      <Address cabin={props.cabinData} />
      <p>{props.chosenText}</p>
    </div>
  );
};

export default TabTextAndAddress;
