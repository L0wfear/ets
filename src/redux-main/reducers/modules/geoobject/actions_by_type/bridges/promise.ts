import {
  geoobjectCreateByType,
  geoobjectRemoveByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import {
  geoobjectLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { bridges } from 'redux-main/reducers/modules/geoobject/constants';
import { Bridges } from 'redux-main/reducers/modules/geoobject/actions_by_type/bridges/@types';
import { GeozoneBridgesService } from 'api/Services';

export const promiseGetBridges = geoobjectLoadByType(bridges);
export const promiseCreateBridges = geoobjectCreateByType(bridges);
export const promiseUpdateBridges = (formState: Bridges) => {
  const payload = {
    ...formState,
  };

  return GeozoneBridgesService.put(payload, false, 'json');
};
export const promiseRemoveBridges = geoobjectRemoveByType(bridges);
