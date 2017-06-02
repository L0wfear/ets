import { render } from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';

import Flux from 'config/flux';
import routes from 'components/indexRoute';
import createStore from 'redux/create';

const flux = new Flux();

const appNode = document.getElementById('container');
/**
 * routes - реакт-компонент, но с компонентом реакт-роутер не работает,
 * поэтому приходится делать именно вызов функции, чтобы вернуть завёрнутые роуты.
 */
const app = (
  <Provider store={createStore()}>
    {routes({ flux })}
  </Provider>
);

render(app, appNode);
