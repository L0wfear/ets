import {
  geoozonesCreateByType,
  geoozonesRemoveByType,
  promiseGeozonesLoadPFByType,
  geoozonesLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { pgm_store } from 'redux-main/reducers/modules/geoobject/constants';
import { PgmStore } from 'redux-main/reducers/modules/geoobject/actions_by_type/pgm_store/@types';
import { GeozonePgmStoreService } from 'api/Services';

export const promiseGetPgmStore = geoozonesLoadByType(pgm_store);
export const promiseLoadPFPgmStore = promiseGeozonesLoadPFByType(pgm_store);
export const promiseCreatePgmStore = geoozonesCreateByType(pgm_store);
export const promiseUpdatePgmStore = (formState: PgmStore) => {
  const payload = {
    ...formState,
  };

  return GeozonePgmStoreService.put(payload, false, 'json');
};
export const promiseRemovePgmStore = geoozonesRemoveByType(pgm_store);
