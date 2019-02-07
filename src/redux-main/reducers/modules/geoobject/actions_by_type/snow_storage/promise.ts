import {
  geoozonesCreateByType,
  geoozonesRemoveByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import {
  geoozonesLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { snow_storage } from 'redux-main/reducers/modules/geoobject/constants';
import { SnowStorage } from 'redux-main/reducers/modules/geoobject/actions_by_type/snow_storage/@types';
import { GeozoneSnowStorageService } from 'api/Services';

export const promiseGetSnowStorage = geoozonesLoadByType(snow_storage);
export const promiseCreateSnowStorage = geoozonesCreateByType(snow_storage);
export const promiseUpdateSnowStorage = (formState: SnowStorage) => {
  const payload = {
    ...formState,
  };

  return GeozoneSnowStorageService.put(payload, false, 'json');
};
export const promiseRemoveSnowStorage = geoozonesRemoveByType(snow_storage);
