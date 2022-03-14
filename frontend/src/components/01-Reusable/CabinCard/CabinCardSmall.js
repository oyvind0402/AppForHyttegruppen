import './CabinCard.css';

const CabinCardSmall = (props) => {
  return (
    <>
      <button className="btn big">{props.name}</button>
    </>
  );
};

export default CabinCardSmall;
