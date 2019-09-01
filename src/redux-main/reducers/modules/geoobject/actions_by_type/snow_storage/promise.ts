import {
  geoozonesCreateByType,
  geoozonesUpdateByType,
  geoozonesLoadByType,
  promiseGeozonesLoadPFByType
} from 'redux-main/reducers/modules/geoobject/promises';
import { snow_storage } from 'redux-main/reducers/modules/geoobject/constants';
import { SnowStorage } from 'redux-main/reducers/modules/geoobject/actions_by_type/snow_storage/@types';

export const promiseGetSnowStorage = geoozonesLoadByType<SnowStorage>(snow_storage);
export const promiseLoadPFSnowStorage = promiseGeozonesLoadPFByType(snow_storage);
export const promiseCreateSnowStorage = geoozonesCreateByType(snow_storage);
export const promiseUpdateSnowStorage = geoozonesUpdateByType(snow_storage);
