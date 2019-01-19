import {
  geoobjectCreateByType,
  geoobjectRemoveByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import {
  geoobjectLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { fueling_water } from 'redux-main/reducers/modules/geoobject/constants';
import { FuelingWater } from 'redux-main/reducers/modules/geoobject/actions_by_type/fueling_water/@types';
import { GeozoneFuelingWaterService } from 'api/Services';

export const promiseGetFuelingWater = geoobjectLoadByType(fueling_water);
export const promiseCreateFuelingWater = geoobjectCreateByType(fueling_water);
export const promiseUpdateFuelingWater = (formState: FuelingWater) => {
  const payload = {
    ...formState,
  };

  return GeozoneFuelingWaterService.put(payload, false, 'json');
};
export const promiseRemoveFuelingWater = geoobjectRemoveByType(fueling_water);
