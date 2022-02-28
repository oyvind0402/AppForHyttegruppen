import { useContext } from 'react';

import LoginContext from '../../LoginContext/login-context';

const Hytteomraade = () => {
  const loginContext = useContext(LoginContext);

  const loggedIn = loginContext.loggedIn;

  return (
    <section>
      <h1>Hytteomraade info :D</h1>
    </section>
  );
};

export default Hytteomraade;
