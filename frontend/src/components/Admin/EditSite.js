import { Link } from 'react-router-dom';
import BackButton from '../01-Reusable/Buttons/BackButton';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import './EditSite.css';

const EditSite = () => {
  return (
    <>
      <BackButton name="Tilbake til admin" link="admin" />
      <HeroBanner name="Endre sideinnhold" />

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
        Endre perioder
      </Link>
    </>
  );
};

export default EditSite;
