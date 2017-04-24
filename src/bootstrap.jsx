import { render } from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';

import { routes } from './components/routes';
import createStore from './redux/create';

render(
  <Provider store={createStore()}>
    {routes}
  </Provider>,
  document.getElementById('container')
);
