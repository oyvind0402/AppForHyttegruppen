import './Button.css';

const TabButton = (props) => {
  return (
    <>
      <button
        className={`btn tabbtn ${props.className}`}
        onClick={props.onClick}
      >
        {props.name}
      </button>
    </>
  );
};

export default TabButton;
