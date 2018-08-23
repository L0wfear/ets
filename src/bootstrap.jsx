import { render } from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';

import Flux from 'config/flux';
import App from 'components/App.tsx';
import createStore from 'redux/create';

const flux = new Flux();

const appNode = document.getElementById('container');
/**
 * routes - реакт-компонент, но с компонентом реакт-роутер не работает,
 * поэтому приходится делать именно вызов функции, чтобы вернуть завёрнутые роуты.
 */
const app = (
  <Provider store={createStore()}>
    <App flux={flux} />
  </Provider>
);

render(app, appNode);

// console.log('%cЕсли здесь появляются красные сообщения, это не значит, что это баг системы.', 'background: #691a99; color: #68efad; font-size: 26px;');
// console.log('%cКатя, остановись!', 'background: #691a99; color: #68efad; font-size: 30px;');
