import {
  geoozonesCreateByType,
  promiseGeozonesLoadPFByType,
  geoozonesLoadByType,
  geoozonesUpdateByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { ssp } from 'redux-main/reducers/modules/geoobject/constants';
import { Ssp } from 'redux-main/reducers/modules/geoobject/actions_by_type/ssp/@types';

export const promiseGetSsp = geoozonesLoadByType<Ssp>(ssp);
export const promiseLoadPFSsp = promiseGeozonesLoadPFByType(ssp);
export const promiseCreateSsp = geoozonesCreateByType(ssp);
export const promiseUpdateSsp = geoozonesUpdateByType(ssp);
