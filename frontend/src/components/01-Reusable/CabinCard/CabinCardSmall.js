import './CabinCardSmall.css';
import { BiBed } from 'react-icons/bi';
import { BiBath } from 'react-icons/bi';
import { GiTakeMyMoney } from 'react-icons/gi';
import { useEffect, useState } from 'react';
import CabinContent from './CabinContent';

const CabinCardSmall = (props) => {
  const [active, setActive] = useState(false);

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

  return (
    <>
      {active === true ? (
        <button
          className="card-small card-small-active"
          onClick={() => setActive(false)}
        >
          <CabinContent cabin={card} />
        </button>
      ) : (
        <button className="card-small" onClick={() => setActive(true)}>
          <CabinContent cabin={card} />
        </button>
      )}
    </>
  );
};

export default CabinCardSmall;
