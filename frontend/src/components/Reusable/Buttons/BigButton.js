import './Button.css';
import { Link } from 'react-router-dom';

const BigButton = (props) => {
  return (
    <>
      <button className="btn big">{props.name}</button>
    </>
  );
};

export default BigButton;
