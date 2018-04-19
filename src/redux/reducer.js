import { combineReducers } from 'redux';
import { loadingReducer } from 'redux-promise-loading';

import rootReducers from 'components/redux/reducer';

import order from 'redux/modules/order/order.ts';
import settings from './modules/settings';
import owners from './modules/owners';
import types from './modules/types';

export default combineReducers({
  ...rootReducers,
  owners,
  types,
  loading: loadingReducer,
  settings,
  order,
});
