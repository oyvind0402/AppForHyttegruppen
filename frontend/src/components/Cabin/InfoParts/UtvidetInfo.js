import { useEffect, useState } from 'react';
import Address from './Address';
import './UtvidetInfo.css';

const UtvidetInfo = (props) => {
  const [winWidth, setWinWidth] = useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener('resize', () => setWinWidth(window.innerWidth));
  }, []);

  return winWidth > 800 ? (
    <div className="utvidetinfo" id="utvidetinfo">
      <p>{props.cabinData.longDescription}</p>
      <Address cabin={props.cabinData} />
    </div>
  ) : (
    <div className="utvidetinfo" id="utvidetinfo">
      <Address cabin={props.cabinData} />
      <p>{props.cabinData.longDescription}</p>
    </div>
  );
};

export default UtvidetInfo;
