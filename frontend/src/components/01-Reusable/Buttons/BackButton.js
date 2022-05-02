import { Link } from 'react-router-dom';
import './Button.css';

const BackButton = (props) => {
  return (
    <>
      <Link className="link back-btn" to={'/' + props.link}>
        <span className="backbtn-arrow">{'❮ '}</span>
        <span className="backbtn-title">{props.name}</span>
      </Link>
    </>
  );
};

export default BackButton;
