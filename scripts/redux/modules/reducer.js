import { combineReducers } from 'redux';
import { loadingReducer } from 'redux-promise-loading';

import settings from './settings';
import owners from './owners';
import types from './types';

export default combineReducers({
  owners,
  types,
  loading: loadingReducer
});
