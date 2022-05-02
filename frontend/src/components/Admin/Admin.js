import { Link } from 'react-router-dom';
import AdminBanner from '../01-Reusable/HeroBanner/AdminBanner';
import './Admin.css';

const Admin = () => {
  return (
    <>
      <AdminBanner name="Admin" />
      <div className="admin-container">
        <Link className="btn-link big btn" to="/admin/startsoknad">
          Åpne søknadsperiode
        </Link>
        <Link className="btn-link big btn" to="/admin/endresoknader">
          Alle søknader
        </Link>
        <Link className="btn-link big btn" to="/admin/endringer">
          Endre nettsidens innhold
        </Link>
      </div>
    </>
  );
};

export default Admin;
