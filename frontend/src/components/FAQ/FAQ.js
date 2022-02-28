import { useContext } from 'react';

import LoginContext from '../../LoginContext/login-context';

const FAQ = () => {
  const loginContext = useContext(LoginContext);

  const loggedIn = loginContext.loggedIn;

  return (
    <section>
      <h1>FAQ info :D</h1>
    </section>
  );
};

export default FAQ;
