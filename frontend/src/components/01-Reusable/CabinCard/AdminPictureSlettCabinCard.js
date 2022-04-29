import './CabinCard.css';
import { BiBed } from 'react-icons/bi';
import { BiBath } from 'react-icons/bi';
import { GrMoney } from 'react-icons/gr';
import { Link } from 'react-router-dom';

const AdminPictureSlettCabinCard = (props) => {
  return (
    <>
      <Link
        className="admin-card admin-card-picture link"
        to={'/admin/slettbilde/' + props.cabin.name}
      >
        <img
          className="card-picture admin-picture"
          src={`${process.env.PUBLIC_URL}/assets/pictures/${props.cabin.pictures.mainPicture.filename}`}
          alt={props.cabin.pictures.mainPicture.altText}
        />
        <div className="card-content-picture">
          <h2 className="card-title-picture">{props.cabin.name}</h2>
        </div>
      </Link>
    </>
  );
};

export default AdminPictureSlettCabinCard;
