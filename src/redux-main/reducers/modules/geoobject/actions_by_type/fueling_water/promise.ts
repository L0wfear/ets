import {
  geoozonesCreateByType,
  geoozonesRemoveByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import {
  geoozonesLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { fueling_water } from 'redux-main/reducers/modules/geoobject/constants';
import { FuelingWater } from 'redux-main/reducers/modules/geoobject/actions_by_type/fueling_water/@types';
import { GeozoneFuelingWaterService } from 'api/Services';

export const promiseGetFuelingWater = geoozonesLoadByType(fueling_water);
export const promiseCreateFuelingWater = geoozonesCreateByType(fueling_water);
export const promiseUpdateFuelingWater = (formState: FuelingWater) => {
  const payload = {
    ...formState,
  };

  return GeozoneFuelingWaterService.put(payload, false, 'json');
};
export const promiseRemoveFuelingWater = geoozonesRemoveByType(fueling_water);
