import { useState } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';

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
          <RiArrowDownSLine
            className="gen-period-arrow-down"
            onClick={handleExpanded}
          />
        </div>
      </div>
      <div className={expanded ? 'gen-period-container-expanded' : 'no-show'}>
        {props.children[2]}
        {props.children[3]}
        {props.children[4]}
        <div className="justify-end">
          <RiArrowUpSLine
            className="gen-period-arrow-up"
            onClick={handleExpanded}
          />
        </div>
      </div>
    </>
  );
};

export default PeriodCard;
