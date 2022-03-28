import BigButtonLink from '../01-Reusable/Buttons/BigButtonLink';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import HomeImage from '../01-Reusable/HomeImage/HomeImage';
import './Admin.css';

const Admin = () => {
  return (
    <>
      <HeroBanner name="Admin" />
      <div className="admin-container">
        <BigButtonLink name="Åpne søknadsperiode" link="/startsoknad" />
        <BigButtonLink name="Endre innhold på siden" link="/hytter" />
        <HomeImage
          imageLink="TripHistory.svg"
          imageAlt="A history of trips"
          buttonText="Se Turhistorikk"
          link="/historikk"
        />
      </div>
    </>
  );
};

export default Admin;
