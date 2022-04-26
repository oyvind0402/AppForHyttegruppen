import { Link } from 'react-router-dom';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import './Admin.css';
import AdminImg from '../../Images/TripHistory.svg';

const Admin = () => {
  return (
    <>
      <HeroBanner name="Admin" />
      <div className="admin-container">
        <Link className="btn-link big btn" to="/admin/startsoknad">
          Åpne søknadsperiode
        </Link>
        <Link className="btn-link big btn" to="/admin/endringer">
          Endre innhold på siden
        </Link>
        <div
          className="admin-picture"
          style={{ backgroundImage: 'url(' + AdminImg + ')' }}
        >
          <Link className="link admin-picture-btn" to="/admin/endresoknader">
            <p className="admin-picture-text">Alle søknader</p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Admin;
