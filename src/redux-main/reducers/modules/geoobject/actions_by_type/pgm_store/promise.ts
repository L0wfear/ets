import {
  geoozonesCreateByType,
  geoozonesUpdateByType,
  promiseGeozonesLoadPFByType,
  geoozonesLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { pgm_store } from 'redux-main/reducers/modules/geoobject/constants';
import { PgmStore } from 'redux-main/reducers/modules/geoobject/actions_by_type/pgm_store/@types';

export const promiseGetPgmStore = geoozonesLoadByType<PgmStore>(pgm_store);
export const promiseLoadPFPgmStore = promiseGeozonesLoadPFByType(pgm_store);
export const promiseCreatePgmStore = geoozonesCreateByType(pgm_store);
export const promiseUpdatePgmStore = geoozonesUpdateByType(pgm_store);
