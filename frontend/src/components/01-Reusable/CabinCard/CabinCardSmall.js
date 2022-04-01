import './CabinCardSmall.css';
import { useState } from 'react';
import CabinContent from './CabinContent';

const CabinCardSmall = (props) => {
  const [active, setActive] = useState(false);

  return (
    <>
      {active === true ? (
        <button
          className="card-small card-small-active"
          onClick={() => setActive(false)}
        >
          <CabinContent cabin={props.cabin} />
        </button>
      ) : (
        <button className="card-small" onClick={() => setActive(true)}>
          <CabinContent cabin={props.cabin} />
        </button>
      )}
    </>
  );
};

export default CabinCardSmall;
