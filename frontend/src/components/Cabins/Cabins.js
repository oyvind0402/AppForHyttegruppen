import { useContext } from 'react';

import LoginContext from '../../LoginContext/login-context';

const Cabins = () => {
  const loginContext = useContext(LoginContext);

  const loggedIn = loginContext.loggedIn;

  return (
    <section>
      <h1>This is a cabin</h1>
    </section>
  );
};

export default Cabins;
