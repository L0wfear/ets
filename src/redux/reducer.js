import { combineReducers } from 'redux';
import { loadingReducer } from 'redux-promise-loading';

import reports from 'components/reports/redux/reducer.tsx';

import settings from './modules/settings';
import owners from './modules/owners';
import types from './modules/types';

export default combineReducers({
  reports,
  owners,
  types,
  loading: loadingReducer,
  settings,
});
