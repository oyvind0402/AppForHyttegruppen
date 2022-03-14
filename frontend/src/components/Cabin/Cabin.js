import { useContext } from 'react';

import LoginContext from '../../LoginContext/login-context';

const Cabin = () => {
  const loginContext = useContext(LoginContext);

  const loggedIn = loginContext.loggedIn;

  return (
    <>
      <h1>Cabin info :D</h1>
    </>
  );
};

export default Cabin;
