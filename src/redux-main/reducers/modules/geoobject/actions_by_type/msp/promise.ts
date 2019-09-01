import {
  geoozonesCreateByType,
  geoozonesUpdateByType,
  promiseGeozonesLoadPFByType,
  geoozonesLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { msp } from 'redux-main/reducers/modules/geoobject/constants';

export const promiseGetMsp = geoozonesLoadByType(msp);
export const promiseLoadPFMsp = promiseGeozonesLoadPFByType(msp);
export const promiseCreateMsp = geoozonesCreateByType(msp);
export const promiseUpdateMsp = geoozonesUpdateByType(msp);
