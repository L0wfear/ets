import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import App from 'components/App';

import Flux from 'config/flux';
import { HashRouter, Switch, Route } from 'react-router-dom';

const flux = new Flux();

const AppConteiner = () => (
  <HashRouter>
    <Switch>
      <Route path="*" render={(props) => (<App {...props} flux={flux} />)} />
    </Switch>
  </HashRouter>

);

export default hot(AppConteiner);
