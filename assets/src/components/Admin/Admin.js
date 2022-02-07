import { useContext } from "react";

import LoginContext from "../../LoginContext/login-context";

const Post = () => {
  const loginContext = useContext(LoginContext);

  const loggedIn = loginContext.loggedIn;

  return (
    <section>
      <h1>Ye olde Admin Page yarr</h1>
    </section>
  );
};

export default Post;
