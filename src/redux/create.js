import { createStore as _createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import createLogger from 'redux-logger';
import { loadingMiddleware } from 'redux-promise-loading';

export default function createStore() {
  const middleware = [thunk, loadingMiddleware(), promiseMiddleware, createLogger({ collapsed: true })];

  const finalCreateStore = applyMiddleware(...middleware)(_createStore);

  const reducer = require('./modules/reducer');
  const store = finalCreateStore(reducer);

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./modules/reducer', () => {
      store.replaceReducer(require('./modules/reducer').default);
    });
  }

  return store;
}
