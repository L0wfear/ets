import { createStore, applyMiddleware } from 'redux';
import rootReducer from 'redux-main/reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

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

  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(
      applyMiddleware(
        ...middlewares,
      ),
    ),
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('redux-main/reducers', () => {
      const nextRootReducer = require('redux-main/reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

export default configureStore;
