import { useContext } from 'react';
import LoginContext from '../../LoginContext/login-context';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';

const MinSide = () => {
  const loginContext = useContext(LoginContext);

  const loggedIn = loginContext.loggedIn;

  return (
    <>
      <HeroBanner name="Mine turer" />
      <h1>MinSide info :D</h1>
    </>
  );
};

export default MinSide;
