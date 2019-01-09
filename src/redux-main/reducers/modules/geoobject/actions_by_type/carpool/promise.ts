import {
  geoobjectCreateByType,
  geoobjectUpdateByType,
  geoobjectRemoveByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import {
  geoobjectLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { carpool } from 'redux-main/reducers/modules/geoobject/constants';

export const promiseGetCarpool = geoobjectLoadByType(carpool);
export const promiseCreateCarpool = geoobjectCreateByType(carpool);
export const promiseUpdateCarpool = geoobjectUpdateByType(carpool);
export const promiseRemoveCarpool = geoobjectRemoveByType(carpool);
