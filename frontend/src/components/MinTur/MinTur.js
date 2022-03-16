import { useContext } from 'react';
import LoginContext from '../../LoginContext/login-context';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';

const MinTur = () => {
  const loginContext = useContext(LoginContext);

  const loggedIn = loginContext.loggedIn;

  return (
    <>
      <HeroBanner name="Min tur" />
      <h1>MinTur info :D</h1>
    </>
  );
};

export default MinTur;
