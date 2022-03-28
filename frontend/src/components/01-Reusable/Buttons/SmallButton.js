import './Button.css';

const SmallButton = (props) => {
  return (
    <>
      <button className={`btn small ${props.className}`}>{props.name}</button>
    </>
  );
};

export default SmallButton;
