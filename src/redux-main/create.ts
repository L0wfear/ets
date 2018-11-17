import { createStore, applyMiddleware } from 'redux';
import rootReducer from 'redux-main/reducers/index';

import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import { loadingMiddleware } from 'redux-promise-loading';

import { etsLoadingMiddleware } from 'redux-main/_middleware/etsLoading';

const configureStore = (initialState?) => {
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

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      ...middlewares,
    ),
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('redux-main/reducers', () => {
      const nextRootReducer = require('redux-main/reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

export default configureStore;
