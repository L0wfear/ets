import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
import EtsThemeProvider from 'components/new/ui/@bootstrap/EtsThemeProvider';

import Flux from 'config/flux';
import { HashRouter, Switch, Route } from 'react-router-dom';
import App from 'components/App';
import configureStore from 'redux-main/create';

const flux = new Flux();
const store = configureStore();

const AppConteiner = () => (
  <Provider store={store}>
    <EtsThemeProvider>
      <HashRouter>
        <Switch>
          <Route path="*" render={(props) => (<App {...props} flux={flux} />)} />
        </Switch>
      </HashRouter>
    </EtsThemeProvider>
  </Provider>
);

export default hot(AppConteiner);
