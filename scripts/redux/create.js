import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import createLogger from 'redux-logger';

export default function createStore() {

  const middleware = [thunk, promiseMiddleware, createLogger({collapsed: true})];

  let finalCreateStore = applyMiddleware(...middleware)(_createStore);

  const reducer = require('./modules/reducer');
  const store = finalCreateStore(reducer);

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./modules/reducer', () => {
      store.replaceReducer(require('./modules/reducer').default);
    });
  }

  return store;
}
