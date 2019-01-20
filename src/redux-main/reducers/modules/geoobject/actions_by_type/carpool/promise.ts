import {
  geoozonesCreateByType,
  geoozonesUpdateByType,
  geoozonesRemoveByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import {
  geoozonesLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { carpool } from 'redux-main/reducers/modules/geoobject/constants';

export const promiseGetCarpool = geoozonesLoadByType(carpool);
export const promiseCreateCarpool = geoozonesCreateByType(carpool);
export const promiseUpdateCarpool = geoozonesUpdateByType(carpool);
export const promiseRemoveCarpool = geoozonesRemoveByType(carpool);
