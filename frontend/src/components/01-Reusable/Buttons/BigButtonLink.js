import './Button.css';
import { Link } from 'react-router-dom';

const BigButtonLink = (props) => {
  return (
    <>
      <button className="btn big">
        <Link className="btn-link" to={props.link}>
          {props.name}
        </Link>
      </button>
    </>
  );
};

export default BigButtonLink;
