import * as React from 'react';
import { hot } from 'react-hot-loader';
import App from 'components/App';

import Flux from 'config/flux';

const flux = new Flux();

const AppConteiner = () => (
  <App flux={flux} />
);

export default hot(module)(AppConteiner);
