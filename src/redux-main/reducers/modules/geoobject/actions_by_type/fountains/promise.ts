import {
  geoobjectCreateByType,
  geoobjectRemoveByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import {
  geoobjectLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { fountains } from 'redux-main/reducers/modules/geoobject/constants';
import { Fountains } from 'redux-main/reducers/modules/geoobject/actions_by_type/fountains/@types';
import { ODHService } from 'api/Services';

export const promiseGetFountains = geoobjectLoadByType(fountains);
export const promiseCreateFountains = geoobjectCreateByType(fountains);
export const promiseUpdateFountains = (formState: Fountains) => {
  const payload = {
    ...formState,
  };

  return ODHService.put(payload, false, 'json');
};
export const promiseRemoveFountains = geoobjectRemoveByType(fountains);
