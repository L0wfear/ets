import {
  geoobjectCreateByType,
  geoobjectRemoveByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import {
  geoobjectLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { ssp } from 'redux-main/reducers/modules/geoobject/constants';
import { Ssp } from 'redux-main/reducers/modules/geoobject/actions_by_type/ssp/@types';
import { ODHService } from 'api/Services';

export const promiseGetSsp = geoobjectLoadByType(ssp);
export const promiseCreateSsp = geoobjectCreateByType(ssp);
export const promiseUpdateSsp = (formState: Ssp) => {
  const payload = {
    ...formState,
  };

  return ODHService.put(payload, false, 'json');
};
export const promiseRemoveSsp = geoobjectRemoveByType(ssp);
