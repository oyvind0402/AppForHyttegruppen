import './CabinCard.css';
import { BiBed } from 'react-icons/bi';
import { BiBath } from 'react-icons/bi';
import { GiTakeMyMoney } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import LoginContext from '../../../LoginContext/login-context';
import { useContext } from 'react';

const CabinCardBig = (props) => {
  const loginContext = useContext(LoginContext);

  return (
    <>
      <button
        className="card"
        onClick={(e) => {
          e.preventDefault();
          window.location.href = `/hytte/${props.cabin.name}`;
        }}
      >
        <img
          className="card-picture"
          src={`${process.env.PUBLIC_URL}/assets/pictures/${props.cabin.pictures.mainPicture.filename}`}
          alt={props.cabin.pictures.mainPicture.altText}
        />
        {loginContext.adminAccess && (
          <Link to={'/admin/endrehytte/' + props.cabin.name}>
            <span className="admin-edit-btn">Endre</span>
          </Link>
        )}

        <div className="card-content">
          <h2 className="card-title">{props.cabin.name}</h2>
          <p className="card-address">{props.cabin.address}</p>

          <div className="card-features">
            <BiBed className="card-icon bed" />
            <p className="card-text bedrooms">
              {props.cabin.features.soverom} soverom
            </p>
            <p className="card-text sleepingslots">
              {props.cabin.features.sengeplasser} sengeplasser
            </p>

            <BiBath className="card-icon bath" />
            <p className="card-text badrooms">{props.cabin.features.bad} Bad</p>

            <GiTakeMyMoney className="card-icon money" />
            <p className="card-text moneyText">
              {props.cabin.price} + {props.cabin.cleaningPrice} NOK
            </p>
          </div>
        </div>
      </button>
    </>
  );
};

export default CabinCardBig;
