import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
import { HashRouter, Switch, Route } from 'react-router-dom';

import EtsThemeProvider from 'components/new/ui/@bootstrap/EtsThemeProvider';
import NotificationSystem from 'components/@next/@ui/@notify/NotificationSystem';
import Prompt from 'components/old/ui/Prompt';

import Flux from 'config/flux';
import App from 'components/old/App';
import configureStore from 'redux-main/create';

const flux = new Flux();
const store = configureStore();

const AppWithRoute = hot(() => (
  <HashRouter>
    <Switch>
      <Route path="*" render={(props) => (<App {...props} flux={flux} />)} />
    </Switch>
  </HashRouter>
));

const AppConteiner = () => (
  <Provider store={store}>
    <EtsThemeProvider>
      <AppWithRoute />
      <NotificationSystem />
      <Prompt />
    </EtsThemeProvider>
  </Provider>
);

export default AppConteiner;
