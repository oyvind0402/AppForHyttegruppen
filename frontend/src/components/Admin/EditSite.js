import { Link } from 'react-router-dom';
import BackButton from '../01-Reusable/Buttons/BackButton';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import './EditSite.css';

const EditSite = () => {
  return (
    <>
      <BackButton name="Tilbake til admin" link="admin" />
      <HeroBanner name="Endre sideinnhold" />

      <Link className="btn-link btn big" to="/endrehytter">
        Endre hytter
      </Link>

      <Link className="btn-link btn big" to="/endresoknader">
        Endre søknader
      </Link>

      <Link className="btn-link btn big" to="/endreperioder">
        Endre perioder
      </Link>

      <Link className="btn-link btn big" to="/endrefunksjonaliteter">
        Endre funksjonaliteter
      </Link>

      <Link className="btn-link btn big" to="/leggtilhytte">
        Legg til hytte
      </Link>

      <Link className="btn-link btn big" to="leggtilperiode">
        Legg til periode
      </Link>

      <Link className="btn-link btn big" to="/leggtilfunksjonalitet">
        Legg til funksjonalitet
      </Link>
    </>
  );
};

export default EditSite;
