import {
  gormostCreateByType,
  gormostUpdateByType,
  gormostLoadByType,
  promiseGormostLoadPFByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { pedestrian_tunnels } from 'redux-main/reducers/modules/geoobject/constants';
import { PedestrianTunnels } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnels/@types';

export const promiseGetPedestrianTunnels = gormostLoadByType<PedestrianTunnels>(pedestrian_tunnels);
export const promiseLoadPFPedestrianTunnels = promiseGormostLoadPFByType(pedestrian_tunnels);
export const promiseCreatePedestrianTunnels = gormostCreateByType(pedestrian_tunnels);
export const promiseUpdatePedestrianTunnels = gormostUpdateByType(pedestrian_tunnels);
