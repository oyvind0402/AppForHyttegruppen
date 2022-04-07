import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

//Based on https://stackoverflow.com/questions/36904185/react-router-scroll-to-top-on-every-transition/58156895
function ScrollToTop({ history }) {
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      unlisten();
    };
  }, [history]);

  return null;
}

export default withRouter(ScrollToTop);
