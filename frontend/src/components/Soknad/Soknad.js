import { useContext } from 'react';

import LoginContext from '../../LoginContext/login-context';

const Soknad = () => {
  const loginContext = useContext(LoginContext);

  const loggedIn = loginContext.loggedIn;

  return (
    <section>
      <h1>Soknad info :D</h1>
    </section>
  );
};

export default Soknad;
