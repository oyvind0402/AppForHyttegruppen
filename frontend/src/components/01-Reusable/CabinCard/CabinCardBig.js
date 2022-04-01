import './CabinCard.css';
import { BiBed } from 'react-icons/bi';
import { BiBath } from 'react-icons/bi';
import { GiTakeMyMoney } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import LoginContext from '../../../LoginContext/login-context';
import { useContext } from 'react';

const card = {
  picture: [
    {
      Name: 'Utsikten',
      Address: 'Grøndalsvegen 764',
      Bedrooms: '5',
      SleepingSlots: '10',
      Bathrooms: '1',
      Price: '1200',
      CleaningPrice: '1200',
      src: './cabin-main.jpg',
      alt: 'Picture of utsikten',
    },
  ],
};

const CabinCardBig = (props) => {
  console.log(props);
  const loginContext = useContext(LoginContext);

  return (
    <>
      <button className="card">
        <img
          className="card-picture"
          src={`${process.env.PUBLIC_URL}/assets/pictures/cabin-main.jpg`}
          alt={card.picture[0].alt}
        />
        {loginContext.adminAccess && (
          <Link to={'/editcabin/' + props.cabin.name}>
            <button className="admin-edit-btn">Endre</button>
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
            <p className="card-text moneyText">{props.cabin.price} Kroner</p>
          </div>
        </div>
      </button>
    </>
  );
};

export default CabinCardBig;
