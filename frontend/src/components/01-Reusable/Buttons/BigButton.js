import './Button.css';

const BigButton = (props) => {
  return (
    <>
      <button className="btn big">{props.name}</button>
    </>
  );
};

export default BigButton;
