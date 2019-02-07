import {
  gormostCreateByType,
  gormostRemoveByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import {
  gormostLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { pedestrian_tunnel_exits } from 'redux-main/reducers/modules/geoobject/constants';
import { PedestrianTunnelExits } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnel_exits/@types';
import { GeozonePedestrianTunnelExitsService } from 'api/Services';

export const promiseGetPedestrianTunnelExits = gormostLoadByType(pedestrian_tunnel_exits);
export const promiseCreatePedestrianTunnelExits = gormostCreateByType(pedestrian_tunnel_exits);
export const promiseUpdatePedestrianTunnelExits = (formState: PedestrianTunnelExits) => {
  const payload = {
    ...formState,
  };

  return GeozonePedestrianTunnelExitsService.put(payload, false, 'json');
};
export const promiseRemovePedestrianTunnelExits = gormostRemoveByType(pedestrian_tunnel_exits);
