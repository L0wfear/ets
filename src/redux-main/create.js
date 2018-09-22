import { createStore as _createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import { createLogger } from 'redux-logger';
import { loadingMiddleware } from 'redux-promise-loading';
import rootReducer from 'redux-main/reducer'

import { etsLoadingMiddleware } from 'redux-main/_middleware/etsLoading';

export default function createStore(initialState) {
  const store = _createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      thunk,
      loadingMiddleware(),
      etsLoadingMiddleware,
      promiseMiddleware,
      createLogger({ collapsed: true }),
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
