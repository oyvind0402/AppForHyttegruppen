import { useContext } from 'react';
import LoginContext from '../../LoginContext/login-context';
import CabinCardBig from '../01-Reusable/CabinCard/CabinCardBig';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import './Cabins.css';

const Cabins = () => {
  const loginContext = useContext(LoginContext);

  const loggedIn = loginContext.loggedIn;

  return (
    <>
      <HeroBanner name="Hytter" />
      <div className="cabins-display">
        <CabinCardBig />
        <CabinCardBig />
        <CabinCardBig />
        <CabinCardBig />
      </div>
    </>
  );
};

export default Cabins;
