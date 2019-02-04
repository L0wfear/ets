import {
  geoozonesCreateByType,
  geoozonesRemoveByType,
  promiseGeozonesLoadPFByType,
  geoozonesLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { dt } from 'redux-main/reducers/modules/geoobject/constants';
import { Dt } from './@types';
import { DTService } from 'api/Services';

export const promiseGetDt = geoozonesLoadByType(dt);
export const promiseLoadPFODt = promiseGeozonesLoadPFByType(dt);
export const promiseCreateDt = geoozonesCreateByType(dt);
export const promiseUpdateDt = (formState: Dt) => {
  const payload = {
    ...formState,
  };

  return DTService.put(payload, false, 'json');
};
export const promiseRemoveDt = geoozonesRemoveByType(dt);
