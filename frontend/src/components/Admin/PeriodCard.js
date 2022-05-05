import { useState } from 'react';

const PeriodCard = (props) => {
  const [expanded, setExpanded] = useState(false);

  /**
   * Switches states for the periods (expanded or not expanded)
   */
  const handleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <div className={!expanded ? 'gen-period-container' : 'no-show'}>
        {props.children[0]}
        {props.children[1]}
        <div className="justify-end">
          <button className="btn-tiny" onClick={handleExpanded}>
            Endre
          </button>
        </div>
      </div>
      <div className={expanded ? 'gen-period-container-expanded' : 'no-show'}>
        {props.children[2]}
        {props.children[3]}
        {props.children[4]}
        <div className="justify-end-expanded">
          <button
            className="btn-tiny"
            onClick={() => {
              let saved = props.method();
              if (!saved) {
              } else {
                handleExpanded();
              }
            }}
          >
            Lagre
          </button>
        </div>
        {props.children[5] && props.children[5]}
      </div>
    </>
  );
};

export default PeriodCard;
