import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import { LoginContextProvider } from './LoginContext/login-context';

ReactDOM.render(
  <LoginContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </LoginContextProvider>,
  document.getElementById('root')
);
