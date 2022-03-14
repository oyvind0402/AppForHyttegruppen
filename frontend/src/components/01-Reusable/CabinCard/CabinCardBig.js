import './CabinCard.css';
import { BiBed } from 'react-icons/bi';
import { BiBath } from 'react-icons/bi';
import { GiTakeMyMoney } from 'react-icons/gi';

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
  return (
    <>
      <button className="card">
        <img
          className="card-picture"
          src={`${process.env.PUBLIC_URL}/assets/pictures/cabin-main.jpg`}
          alt={card.picture[0].alt}
        />

        <div className="card-content">
          <h2 className="card-title">{card.picture[0].Name}</h2>
          <p className="card-address">{card.picture[0].Address}</p>

          <div className="card-features">
            <BiBed className="card-icon bed" />
            <p className="card-text bedrooms">
              {card.picture[0].Bedrooms} soverom
            </p>
            <p className="card-text sleepingslots">
              {card.picture[0].SleepingSlots} sengeplasser
            </p>

            <BiBath className="card-icon bath" />
            <p className="card-text badrooms">
              {card.picture[0].Bathrooms} Bad
            </p>

            <GiTakeMyMoney className="card-icon money" />
            <p className="card-text moneyText">
              {card.picture[0].Price} Kroner
            </p>
          </div>
        </div>
      </button>
    </>
  );
};

export default CabinCardBig;
