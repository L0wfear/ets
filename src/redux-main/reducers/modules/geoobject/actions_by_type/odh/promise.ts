import {
  geoozonesCreateByType,
  geoozonesRemoveByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import {
  geoozonesLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { odh } from 'redux-main/reducers/modules/geoobject/constants';
import { Odh } from 'redux-main/reducers/modules/geoobject/actions_by_type/odh/@types';
import { ODHService } from 'api/Services';

export const promiseGetOdh = geoozonesLoadByType(odh);
export const promiseCreateOdh = geoozonesCreateByType(odh);
export const promiseUpdateOdh = (formState: Odh) => {
  const payload = {
    ...formState,
  };

  return ODHService.put(payload, false, 'json');
};
export const promiseRemoveOdh = geoozonesRemoveByType(odh);
