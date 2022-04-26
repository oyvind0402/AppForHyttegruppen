import './Button.css';
import { Link } from 'react-router-dom';

const BigButtonLink = (props) => {
  return (
    <>
      <Link className="btn-link btn big" to={props.link}>
        {props.name}
      </Link>
    </>
  );
};

export default BigButtonLink;
