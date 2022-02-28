import { useContext } from 'react';

import LoginContext from '../../LoginContext/login-context';

const MinTur = () => {
  const loginContext = useContext(LoginContext);

  const loggedIn = loginContext.loggedIn;

  return (
    <section>
      <h1>MinTur info :D</h1>
    </section>
  );
};

export default MinTur;
