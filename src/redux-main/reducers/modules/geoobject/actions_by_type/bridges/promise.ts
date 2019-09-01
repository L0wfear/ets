import {
  gormostCreateByType,
  gormostUpdateByType,
  promiseGormostLoadPFByType,
  gormostLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { bridges } from 'redux-main/reducers/modules/geoobject/constants';
import { Bridges } from 'redux-main/reducers/modules/geoobject/actions_by_type/bridges/@types';

export const promiseGetBridges = gormostLoadByType<Bridges>(bridges);
export const promiseLoadPFBridges = promiseGormostLoadPFByType(bridges);
export const promiseCreateBridges = gormostCreateByType(bridges);
export const promiseUpdateBridges = gormostUpdateByType(bridges);
