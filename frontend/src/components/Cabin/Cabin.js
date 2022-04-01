import { useContext } from 'react';
import LoginContext from '../../LoginContext/login-context';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';

const Cabin = () => {
  const loginContext = useContext(LoginContext);
  const loggedIn = loginContext.loggedIn;

  const link = window.location.href;
  const pageID = link.split('/');
  console.log(pageID[pageID.length - 1]);
  getCabin(pageID[pageID.length - 1]);

  async function getCabin() {
    const response = await fetch('/cabin/get', {
      method: 'POST',
      body: JSON.stringify(pageID),
    });

    const data = await response.json();
    if (response.ok) {
      //do something
    }
  }

  return (
    <>
      <HeroBanner name="Hytte" />
      <h1>Cabin info :D</h1>
    </>
  );
};

export default Cabin;
