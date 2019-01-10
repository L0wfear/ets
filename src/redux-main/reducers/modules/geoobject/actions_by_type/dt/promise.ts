import {
  geoobjectCreateByType,
  geoobjectRemoveByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import {
  geoobjectLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { dt } from 'redux-main/reducers/modules/geoobject/constants';
import { Dt } from './@types';
import { DTService } from 'api/Services';

export const promiseGetDt = geoobjectLoadByType(dt);
export const promiseCreateDt = geoobjectCreateByType(dt);
export const promiseUpdateDt = (formState: Dt) => {
  const payload = {
    ...formState,
  };

  return DTService.put(payload, false, 'json');
};
export const promiseRemoveDt = geoobjectRemoveByType(dt);
