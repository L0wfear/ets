import { combineReducers } from 'redux';
import { loadingReducer } from 'redux-promise-loading';


import counter from './counter';
import owners from './owners';
import types from './types';

export default combineReducers({
  counter,
  owners,
  types,
  loading: loadingReducer
});
