import './CabinCard.css';
import { BiBed } from 'react-icons/bi';
import { BiBath } from 'react-icons/bi';
import { GrMoney } from 'react-icons/gr';
import { Link } from 'react-router-dom';

const AdminCabinCardBig = (props) => {
  if (typeof props.cabin === 'undefined' || props.cabin === null) {
    return <></>;
  }

  return (
    <>
      <Link
        className="admin-card link"
        to={'/admin/endrehytte/' + props.cabin.name}
      >
        <img
          className="card-picture"
          src={`${process.env.PUBLIC_URL}/assets/pictures/${props.cabin.pictures.mainPicture.filename}`}
          alt={props.cabin.pictures.mainPicture.altText}
        />
        <span className="admin-edit-btn">Endre</span>
        <div className="card-content">
          <h2 className="card-title">{props.cabin.name}</h2>
          <p className="card-address">{props.cabin.address}</p>

          <div className="card-features">
            <BiBed className="card-icon bed" aria-label="Bed icon" />
            <p className="card-text bedrooms">
              {props.cabin.features.soverom} soverom
            </p>
            <p className="card-text sleepingslots">
              {props.cabin.features.sengeplasser} sengeplasser
            </p>

            <BiBath className="card-icon bath" aria-label="Bathroom icon" />
            <p className="card-text badrooms">{props.cabin.features.bad} Bad</p>

            <GrMoney className="card-icon money" aria-label="Money icon" />
            <p className="card-text moneyText">
              {props.cabin.price} + {props.cabin.cleaningPrice} NOK
            </p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default AdminCabinCardBig;
