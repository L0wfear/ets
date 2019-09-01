import {
  geoozonesCreateByType,
  geoozonesUpdateByType,
  promiseGeozonesLoadPFByType,
  geoozonesLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { carpool } from 'redux-main/reducers/modules/geoobject/constants';
import { Carpool } from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/@types';

export const promiseGetCarpool = geoozonesLoadByType<Carpool>(carpool);
export const promiseLoadPFCarpool = promiseGeozonesLoadPFByType(carpool);
export const promiseCreateCarpool = geoozonesCreateByType(carpool);
export const promiseUpdateCarpool = geoozonesUpdateByType(carpool);
