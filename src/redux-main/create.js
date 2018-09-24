import { createStore as _createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import { loadingMiddleware } from 'redux-promise-loading';
import rootReducer from 'redux-main/reducer';

import { etsLoadingMiddleware } from 'redux-main/_middleware/etsLoading';

export default function createStore(initialState) {
  const middlewares = [
    thunk,
    loadingMiddleware(),
    etsLoadingMiddleware,
    promiseMiddleware,
  ];

  if (process.env.NODE_ENV === 'development') {
    const { createLogger } = require('redux-logger');

    middlewares.push(createLogger({ collapsed: true }));
  }

  const store = _createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      ...middlewares,
    ),
  );

  if (module.hot) {
    module.hot.accept('./reducer', () => {
      const nextRootReducer = require('./reducer');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
