import * as React from 'react';
import ReactDom from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from 'components/App';

import Flux from 'config/flux';


import { Provider } from 'react-redux';
import createStore from 'redux-main/create';

const store = createStore();
const flux = new Flux();

const render = (Component) => {
  ReactDom.render(
    <Provider store={store}>
      <AppContainer>
        <Component flux={flux} />
      </AppContainer>
    </Provider>,
    document.getElementById('container'),
  );
};

render(App);

if (module.hot) {
  module.hot.accept('components/App', () => {
    render(App);
  });
}


// console.log('%cЕсли здесь появляются красные сообщения, это не значит, что это баг системы.', 'background: #691a99; color: #68efad; font-size: 26px;'); // eslint-disable-line
// console.log('%cКатя, остановись!', 'background: #691a99; color: #68efad; font-size: 30px;'); // eslint-disable-line
