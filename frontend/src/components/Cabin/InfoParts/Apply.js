import React from 'react';
import BigButtonLink from '../../01-Reusable/Buttons/BigButtonLink';
import { FeatureIcon } from '../../01-Reusable/FeatureIcon/FeatureIcon';
import './Apply.css';

export const Apply = (props) => {
  const cabin = props.cabinData;

  if (cabin === null || typeof cabin === undefined) {
    return <></>;
  }

  return (
    <div className="to-soknad">
      <BigButtonLink name={`Søk på ${cabin.name}`} link="/soknad" />
      <div className="prices">
        <Price which="price" val={cabin.price} />
        <Price which="cleaningPrice" val={cabin.cleaningPrice} />
      </div>
    </div>
  );
};

const Price = (props) => {
  const priceName = props.which === 'cleaningPrice' ? 'Vasking' : 'Leie';
  return (
    <div className="price-item">
      <FeatureIcon feature={props.which} bool={undefined} />
      <div className="price-text">
        <p>{priceName}</p>
        <p>kr {props.val},00</p>
      </div>
    </div>
  );
};
