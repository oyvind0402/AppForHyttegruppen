import './Button.css';
import { Link } from 'react-router-dom';

const SmallButton = (props) => {
  return (
    <>
      <button className="btn small">{props.name}</button>
    </>
  );
};

export default SmallButton;
