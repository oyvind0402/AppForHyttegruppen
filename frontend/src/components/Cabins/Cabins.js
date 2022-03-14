import { useContext } from 'react';
import LoginContext from '../../LoginContext/login-context';
import CabinCardBig from '../01-Reusable/CabinCard/CabinCardBig';
import './Cabins.css';

const Cabins = () => {
  const loginContext = useContext(LoginContext);

  const loggedIn = loginContext.loggedIn;

  return (
    <>
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
