import { useContext } from 'react';
import LoginContext from '../../LoginContext/login-context';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import './Soknad.css';

const Soknad = () => {
  const loginContext = useContext(LoginContext);

  const loggedIn = loginContext.loggedIn;

  return (
    <>
      <HeroBanner name="Søknad om hytte" />
      <div className="progressbar">
        <p className="progress-step activeProgress step1">1. Info</p>
        <hr className="progress-line" />
        <p className="progress-step passedProgress step2">2. Perioder</p>
        <hr className="progress-line" />
        <p className="progress-step not-activeProgress step3">3. Hytter</p>
      </div>
    </>
  );
};

export default Soknad;
