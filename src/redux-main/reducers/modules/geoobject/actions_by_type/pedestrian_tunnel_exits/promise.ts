import {
  geoobjectCreateByType,
  geoobjectRemoveByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import {
  geoobjectLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { pedestrian_tunnel_exits } from 'redux-main/reducers/modules/geoobject/constants';
import { PedestrianTunnelExits } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnel_exits/@types';
import { GeozonePedestrianTunnelExitsService } from 'api/Services';

export const promiseGetPedestrianTunnelExits = geoobjectLoadByType(pedestrian_tunnel_exits);
export const promiseCreatePedestrianTunnelExits = geoobjectCreateByType(pedestrian_tunnel_exits);
export const promiseUpdatePedestrianTunnelExits = (formState: PedestrianTunnelExits) => {
  const payload = {
    ...formState,
  };

  return GeozonePedestrianTunnelExitsService.put(payload, false, 'json');
};
export const promiseRemovePedestrianTunnelExits = geoobjectRemoveByType(pedestrian_tunnel_exits);
