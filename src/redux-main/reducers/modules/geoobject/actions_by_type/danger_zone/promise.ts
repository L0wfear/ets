import {
  geoozonesCreateByType,
  geoozonesRemoveByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import {
  geoozonesLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { danger_zone } from 'redux-main/reducers/modules/geoobject/constants';
import { DangerZone } from 'redux-main/reducers/modules/geoobject/actions_by_type/danger_zone/@types';
import { GeozoneDangerZoneService } from 'api/Services';

export const promiseGetDangerZone = geoozonesLoadByType(danger_zone);
export const promiseCreateDangerZone = geoozonesCreateByType(danger_zone);
export const promiseUpdateDangerZone = (formState: DangerZone) => {
  const payload = {
    ...formState,
  };

  return GeozoneDangerZoneService.put(payload, false, 'json');
};
export const promiseRemoveDangerZone = geoozonesRemoveByType(danger_zone);
