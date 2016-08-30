import { combineReducers } from 'redux';
// import multireducer from 'multireducer';
// import { routerReducer } from 'react-router-redux';
// import {reducer as reduxAsyncConnect} from 'redux-async-connect';

// import element from './element';
import counter from './counter';
import owners from './owners';
import types from './types';
// import owner from './owner';
// import {reducer as form} from 'redux-form';

export default combineReducers({
  // routing: routerReducer,
  // reduxAsyncConnect,
  counter,
  owners,
  types
  // element,
  // form,
});
