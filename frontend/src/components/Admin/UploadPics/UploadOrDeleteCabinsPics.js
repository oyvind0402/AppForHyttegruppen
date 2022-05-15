import { Link } from 'react-router-dom';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import AdminBanner from '../../01-Reusable/HeroBanner/AdminBanner';
import './UploadCabinPics.css';

const UploadOrDeleteCabinsPics = () => {
  return (
    <>
      <BackButton name="Tilbake til endre sideinnhold" link="admin/endringer" />
      <AdminBanner name="Rediger bilder" />
      <Link className="btn-link big btn" to="/admin/lastoppbilder">
        Legg til bilder
      </Link>
      <Link className="btn-link big btn" to="/admin/slettbilder">
        Fjern bilder
      </Link>
    </>
  );
};

export default UploadOrDeleteCabinsPics;
