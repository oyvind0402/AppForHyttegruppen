import './CabinCardSmall.css';
import { BiBed } from 'react-icons/bi';
import { BiBath } from 'react-icons/bi';

const CabinCardSmallContent = (props) => {
  return (
    <>
      <div className="card-content-small">
        <h2 className="card-title"></h2>
      </div>
    </>
  );
};

export default CabinCardSmallContent;

/*
<img
        className="card-picture-small"
        src={`${process.env.PUBLIC_URL}/assets/pictures/cabin-main.jpg`}
      />
*/

/*        <p className="card-address"></p>

        <div className="card-features-small">
          <BiBed className="card-icon-small bed" />
          <p className="card-text sleepingslots"> sengeplasser</p>

          <BiBath className="card-icon-small bath" />
          <p className="card-text badrooms"> Bad</p>
        </div>*/
