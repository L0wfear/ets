import {
  geoozonesCreateByType,
  promiseGeozonesLoadPFByType,
  geoozonesLoadByType,
  geoozonesUpdateByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { danger_zone } from 'redux-main/reducers/modules/geoobject/constants';
import { DangerZone } from 'redux-main/reducers/modules/geoobject/actions_by_type/danger_zone/@types';

export const promiseGetDangerZone = geoozonesLoadByType<DangerZone>(danger_zone);
export const promiseLoadPFDangerZone = promiseGeozonesLoadPFByType(danger_zone);
export const promiseCreateDangerZone = geoozonesCreateByType(danger_zone);
export const promiseUpdateDangerZone = geoozonesUpdateByType(danger_zone);
