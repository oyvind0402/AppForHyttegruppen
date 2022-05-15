import { Link } from 'react-router-dom';
import BackButton from '../01-Reusable/Buttons/BackButton';
import AdminBanner from '../01-Reusable/HeroBanner/AdminBanner';
import './EditSite.css';

const EditSite = () => {
  return (
    <>
      <BackButton name="Tilbake til admin" link="admin" />
      <AdminBanner name="Endre nettside innhold" />

      <Link className="btn-link btn big" to="/admin/leggtilhytte">
        Legg til hytte
      </Link>

      <Link className="btn-link btn big" to="/admin/endrehytter">
        Endre hytter
      </Link>

      <Link className="btn-link btn big" to="/admin/redigerbilder">
        Rediger bilder
      </Link>

      <Link className="btn-link btn big" to="/admin/endrefaqs">
        Rediger FAQ
      </Link>

      <Link className="btn-link btn big" to="/admin/endreperioder">
        Endre perioder / sesonger
      </Link>

      <Link className="btn-link btn big" to="/admin/innstillinger">
        Admin innstillinger
      </Link>
    </>
  );
};

export default EditSite;
