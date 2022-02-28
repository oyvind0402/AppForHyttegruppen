import { useContext } from 'react';

import LoginContext from '../../LoginContext/login-context';

const MinSide = () => {
  const loginContext = useContext(LoginContext);

  const loggedIn = loginContext.loggedIn;

  return (
    <section>
      <h1>MinSide info :D</h1>
    </section>
  );
};

export default MinSide;
