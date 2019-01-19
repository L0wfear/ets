import {
  geoobjectCreateByType,
  geoobjectRemoveByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import {
  geoobjectLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { pgm_store } from 'redux-main/reducers/modules/geoobject/constants';
import { PgmStore } from 'redux-main/reducers/modules/geoobject/actions_by_type/pgm_store/@types';
import { GeozonePgmStoreService } from 'api/Services';

export const promiseGetPgmStore = geoobjectLoadByType(pgm_store);
export const promiseCreatePgmStore = geoobjectCreateByType(pgm_store);
export const promiseUpdatePgmStore = (formState: PgmStore) => {
  const payload = {
    ...formState,
  };

  return GeozonePgmStoreService.put(payload, false, 'json');
};
export const promiseRemovePgmStore = geoobjectRemoveByType(pgm_store);
