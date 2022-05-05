import './CabinCardSmall.css';
import { useState } from 'react';
import CabinContent from './CabinContent';

const CabinCardSmall = (props) => {
  const [active, setActive] = useState(false);

  if (typeof props.cabin === 'undefined' || props.cabin === null) {
    return <></>;
  }

  return (
    <>
      {active === true ? (
        <button
          className="card-small card-small-active"
          onClick={() => {
            setActive(false);
            props.updatePickedCabin(false, props.index);
          }}
        >
          <CabinContent cabin={props.cabin} />
        </button>
      ) : (
        <button
          className="card-small"
          onClick={() => {
            setActive(true);
            props.updatePickedCabin(true, props.index);
          }}
        >
          <CabinContent cabin={props.cabin} />
        </button>
      )}
    </>
  );
};

export default CabinCardSmall;
