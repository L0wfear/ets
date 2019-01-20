import {
  gormostCreateByType,
  gormostRemoveByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import {
  gormostLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { bridges } from 'redux-main/reducers/modules/geoobject/constants';
import { Bridges } from 'redux-main/reducers/modules/geoobject/actions_by_type/bridges/@types';
import { GeozoneBridgesService } from 'api/Services';

export const promiseGetBridges = gormostLoadByType(bridges);
export const promiseCreateBridges = gormostCreateByType(bridges);
export const promiseUpdateBridges = (formState: Bridges) => {
  const payload = {
    ...formState,
  };

  return GeozoneBridgesService.put(payload, false, 'json');
};
export const promiseRemoveBridges = gormostRemoveByType(bridges);
