import {
  geoozonesCreateByType,
  geoozonesRemoveByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import {
  geoozonesLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { ssp } from 'redux-main/reducers/modules/geoobject/constants';
import { Ssp } from 'redux-main/reducers/modules/geoobject/actions_by_type/ssp/@types';
import { GeozoneSspService } from 'api/Services';

export const promiseGetSsp = geoozonesLoadByType(ssp);
export const promiseCreateSsp = geoozonesCreateByType(ssp);
export const promiseUpdateSsp = (formState: Ssp) => {
  const payload = {
    ...formState,
  };

  return GeozoneSspService.put(payload, false, 'json');
};
export const promiseRemoveSsp = geoozonesRemoveByType(ssp);
