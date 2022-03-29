import { useContext } from 'react';
import LoginContext from '../../LoginContext/login-context';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';

const Cabin = () => {
  const loginContext = useContext(LoginContext);
  const loggedIn = loginContext.loggedIn;

  return (
    <>
      <HeroBanner name="Hytte" />
      <h1>Cabin info :D</h1>
    </>
  );
};

export default Cabin;
