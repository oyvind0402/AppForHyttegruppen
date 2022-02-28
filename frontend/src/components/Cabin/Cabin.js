import { useContext } from 'react';

import LoginContext from '../../LoginContext/login-context';

const Cabin = () => {
  const loginContext = useContext(LoginContext);

  const loggedIn = loginContext.loggedIn;

  return (
    <section>
      <h1>Cabin info :D</h1>
    </section>
  );
};

export default Cabin;
