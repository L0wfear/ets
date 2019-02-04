import {
  geoozonesCreateByType,
  geoozonesRemoveByType,
  promiseGeozonesLoadPFByType,
  geoozonesLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { msp } from 'redux-main/reducers/modules/geoobject/constants';
import { Msp } from 'redux-main/reducers/modules/geoobject/actions_by_type/msp/@types';
import { GeozoneMspService } from 'api/Services';

export const promiseGetMsp = geoozonesLoadByType(msp);
export const promiseLoadPFMsp = promiseGeozonesLoadPFByType(msp);
export const promiseCreateMsp = geoozonesCreateByType(msp);
export const promiseUpdateMsp = (formState: Msp) => {
  const payload = {
    ...formState,
  };

  return GeozoneMspService.put(payload, false, 'json');
};
export const promiseRemoveMsp = geoozonesRemoveByType(msp);
