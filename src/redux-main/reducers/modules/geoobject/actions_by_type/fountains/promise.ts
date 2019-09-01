import {
  gormostCreateByType,
  gormostRemoveByType,
  promiseGormostLoadPFByType,
  gormostLoadByType,
  gormostUpdateByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { fountains } from 'redux-main/reducers/modules/geoobject/constants';
import { Fountains } from 'redux-main/reducers/modules/geoobject/actions_by_type/fountains/@types';

export const promiseGetFountains = gormostLoadByType<Fountains>(fountains);
export const promiseLoadPFFountains = promiseGormostLoadPFByType(fountains);
export const promiseCreateFountains = gormostCreateByType(fountains);
export const promiseUpdateFountains = gormostUpdateByType(fountains);
export const promiseRemoveFountains = gormostRemoveByType(fountains);
