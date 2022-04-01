import { Link } from 'react-router-dom';
import BackButton from '../01-Reusable/Buttons/BackButton';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import './EditSite.css';

const EditSite = () => {
  return (
    <>
      <BackButton name="Tilbake til admin" link="admin" />
      <HeroBanner name="Endre sideinnhold" />

      <Link className="link" to="/endrehytter">
        <button className="btn big">Endre hytter</button>
      </Link>
      <Link className="link" to="/endreperioder">
        <button className="btn big">Endre perioder</button>
      </Link>
      <Link className="link" to="/endrefunksjonaliteter">
        <button className="btn big">Endre funksjonaliteter</button>
      </Link>
      <Link className="link" to="/leggtilhytte">
        <button className="btn big">Legg til hytte</button>
      </Link>
      <Link className="link" to="leggtilperiode">
        <button className="btn big">Legg til periode</button>
      </Link>
      <Link className="link" to="/leggtilfunksjonalitet">
        <button className="btn big">Legg til funksjonalitet</button>
      </Link>
    </>
  );
};

export default EditSite;
