import { combineReducers } from 'redux';
import { loadingReducer } from 'redux-promise-loading';

import rootReducers from 'components/redux/reducer';

import bigDataCars from 'redux/modules/bigDataCars';
import carsPoints from 'redux/modules/carsPoints';
import owners from 'redux/modules/owners';
import settings from 'redux/modules/settings';
import types from 'redux/modules/types';
import oneCarInfo from 'redux/modules/oneCarInfo';
import toolbar from 'redux/modules/toolbar';
import geoObjects from 'redux/modules/geoObjects';
import session from 'redux/modules/session';

export default combineReducers({
  ...rootReducers,
  bigDataCars,
  carsPoints,
  owners,
  types,
  loading: loadingReducer,
  settings,
  oneCarInfo,
  toolbar,
  geoObjects,
  session,
});
