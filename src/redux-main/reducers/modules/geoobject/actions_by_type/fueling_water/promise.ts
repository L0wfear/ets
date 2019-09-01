import {
  geoozonesCreateByType,
  geoozonesRemoveByType,
  promiseGeozonesLoadPFByType,
  geoozonesLoadByType,
  geoozonesUpdateByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { fueling_water } from 'redux-main/reducers/modules/geoobject/constants';
import { FuelingWater } from 'redux-main/reducers/modules/geoobject/actions_by_type/fueling_water/@types';

export const promiseGetFuelingWater = geoozonesLoadByType<FuelingWater>(fueling_water);
export const promiseLoadPFFuelingWater = promiseGeozonesLoadPFByType(fueling_water);
export const promiseCreateFuelingWater = geoozonesCreateByType(fueling_water);
export const promiseUpdateFuelingWater = geoozonesUpdateByType(fueling_water);
export const promiseRemoveFuelingWater = geoozonesRemoveByType(fueling_water);
