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

if (process.env.STAND === 'dev') {
  console.log('%c🚧 Это сообщение отображается только на development-сервере. 🚧', 'background: #691a99; color: #68efad; font-size: 26px;');
  console.log('%cКатя, остановись!', 'background: #691a99; color: #68efad; font-size: 30px;');
  console.log('%cЕсли здесь появляются красные сообщения, это не значит, что это баг системы.', 'background: #691a99; color: #68efad; font-size: 26px;');
}
