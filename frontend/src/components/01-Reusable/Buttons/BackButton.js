import { Link } from 'react-router-dom';
import './Button.css';

const BackButton = (props) => {
  return (
    <>
      <Link className="link" to={'/' + props.link}>
        <button className="back-btn">
          <span className="backbtn-arrow">{'❮ '}</span>
          <span className="backbtn-title">{props.name}</span>
        </button>
      </Link>
    </>
  );
};

export default BackButton;
