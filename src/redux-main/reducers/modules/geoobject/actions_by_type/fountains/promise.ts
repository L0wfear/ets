import {
  gormostCreateByType,
  gormostRemoveByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import {
  gormostLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { fountains } from 'redux-main/reducers/modules/geoobject/constants';
import { Fountains } from 'redux-main/reducers/modules/geoobject/actions_by_type/fountains/@types';
import { GeozoneFountainsService } from 'api/Services';

export const promiseGetFountains = gormostLoadByType(fountains);
export const promiseCreateFountains = gormostCreateByType(fountains);
export const promiseUpdateFountains = (formState: Fountains) => {
  const payload = {
    ...formState,
  };

  return GeozoneFountainsService.put(payload, false, 'json');
};
export const promiseRemoveFountains = gormostRemoveByType(fountains);
