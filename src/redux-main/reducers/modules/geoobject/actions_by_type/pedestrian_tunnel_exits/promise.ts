import {
  gormostCreateByType,
  gormostUpdateByType,
  promiseGormostLoadPFByType,
  gormostLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { pedestrian_tunnel_exits } from 'redux-main/reducers/modules/geoobject/constants';
import { PedestrianTunnelExits } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnel_exits/@types';

export const promiseGetPedestrianTunnelExits = gormostLoadByType<PedestrianTunnelExits>(pedestrian_tunnel_exits);
export const promiseLoadPFPedestrianTunnelExits = promiseGormostLoadPFByType(pedestrian_tunnel_exits);
export const promiseCreatePedestrianTunnelExits = gormostCreateByType(pedestrian_tunnel_exits);
export const promiseUpdatePedestrianTunnelExits = gormostUpdateByType(pedestrian_tunnel_exits);
