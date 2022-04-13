import { FeatureIcon } from '../../01-Reusable/FeatureIcon/FeatureIcon';
import './Address.css';

const Address = (props) => {
  const mapsLink = `https://www.google.com/maps/dir//${props.cabin.coordinates.latitude},${props.cabin.coordinates.longitude}/@${props.cabin.coordinates.latitude},${props.cabin.coordinates.longitude},16z`;
  return (
    <div className="address">
      <FeatureIcon feature="address" className="address-svg" />
      <div className="address-txt">
        <p>Adresse</p>
        <a href={mapsLink} target="_blank" rel="noopener noreferrer">
          {props.cabin.address}
        </a>
      </div>
    </div>
  );
};

export default Address;
