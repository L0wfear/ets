import { combineReducers } from 'redux';
import { loadingReducer } from 'redux-promise-loading';

import rootReducers from 'components/redux/reducer';

import order from 'redux/modules/order/order.ts';
import bigDataCars from 'redux/modules/bigDataCars';
import carsPoints from 'redux/modules/carsPoints';
import oneCarInfo from 'redux/modules/oneCarInfo';
import toolbar from 'redux/modules/toolbar';
import geoObjects from 'redux/modules/geoObjects';
import session from 'redux/modules/session';
import settings from './modules/settings';
import owners from './modules/owners';
import types from './modules/types';

export default combineReducers({
  ...rootReducers,
  bigDataCars,
  carsPoints,
  owners,
  types,
  loading: loadingReducer,
  settings,
  order,
  oneCarInfo,
  toolbar,
  geoObjects,
  session,
});
