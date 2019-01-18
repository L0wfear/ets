import {
  geoobjectCreateByType,
  geoobjectRemoveByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import {
  geoobjectLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { danger_zone } from 'redux-main/reducers/modules/geoobject/constants';
import { DangerZone } from 'redux-main/reducers/modules/geoobject/actions_by_type/danger_zone/@types';
import { GeozoneDangerZoneService } from 'api/Services';

export const promiseGetDangerZone = geoobjectLoadByType(danger_zone);
export const promiseCreateDangerZone = geoobjectCreateByType(danger_zone);
export const promiseUpdateDangerZone = (formState: DangerZone) => {
  const payload = {
    ...formState,
  };

  return GeozoneDangerZoneService.put(payload, false, 'json');
};
export const promiseRemoveDangerZone = geoobjectRemoveByType(danger_zone);
