import {
  geoobjectCreateByType,
  geoobjectRemoveByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import {
  geoobjectLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { odh } from 'redux-main/reducers/modules/geoobject/constants';
import { Odh } from 'redux-main/reducers/modules/geoobject/actions_by_type/odh/@types';
import { ODHService } from 'api/Services';

export const promiseGetOdh = geoobjectLoadByType(odh);
export const promiseCreateOdh = geoobjectCreateByType(odh);
export const promiseUpdateOdh = (formState: Odh) => {
  const payload = {
    ...formState,
  };

  return ODHService.put(payload, false, 'json');
};
export const promiseRemoveOdh = geoobjectRemoveByType(odh);
