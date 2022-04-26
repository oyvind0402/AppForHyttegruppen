import BackButton from '../01-Reusable/Buttons/BackButton';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import './Soknad.css';

const SoknadStengt = () => {
  return (
    <>
      <BackButton name="Tilbake til hovedsiden" link="" />
      <HeroBanner name="Søknadsperioden er stengt" />
      <p className="soknad-stengt-text">
        Søknadsperioden er stengt, du kan søke på hytter når du får en epost /
        notifikasjon fra hyttekomiteen om at søknadsperioden er åpnet!
      </p>
    </>
  );
};

export default SoknadStengt;
