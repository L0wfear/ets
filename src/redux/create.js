import { createStore as _createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import { createLogger } from 'redux-logger';
import { loadingMiddleware } from 'redux-promise-loading';

import { etsLoadingMiddleware } from 'redux/_middleware/etsLoading';

export default function createStore() {
  const middleware = [thunk, loadingMiddleware(), etsLoadingMiddleware, promiseMiddleware, createLogger({ collapsed: true })];

  const finalCreateStore = applyMiddleware(...middleware)(_createStore);

  const reducer = require('./reducer').default;
  const store = finalCreateStore(reducer);

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./reducer', () => {
      store.replaceReducer(require('./reducer').default);
    });
  }

  return store;
}
