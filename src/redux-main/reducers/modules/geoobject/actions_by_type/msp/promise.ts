import {
  geoobjectCreateByType,
  geoobjectRemoveByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import {
  geoobjectLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { msp } from 'redux-main/reducers/modules/geoobject/constants';
import { Msp } from 'redux-main/reducers/modules/geoobject/actions_by_type/msp/@types';
import { ODHService } from 'api/Services';

export const promiseGetMsp = geoobjectLoadByType(msp);
export const promiseCreateMsp = geoobjectCreateByType(msp);
export const promiseUpdateMsp = (formState: Msp) => {
  const payload = {
    ...formState,
  };

  return ODHService.put(payload, false, 'json');
};
export const promiseRemoveMsp = geoobjectRemoveByType(msp);
