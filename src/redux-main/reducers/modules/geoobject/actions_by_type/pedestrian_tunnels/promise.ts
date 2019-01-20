import {
  geoobjectCreateByType,
  geoobjectRemoveByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import {
  geoobjectLoadByType,
} from 'redux-main/reducers/modules/geoobject/promises';
import { pedestrian_tunnels } from 'redux-main/reducers/modules/geoobject/constants';
import { PedestrianTunnels } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnels/@types';
import { GeozonePedestrianTunnelsService } from 'api/Services';

export const promiseGetPedestrianTunnels = geoobjectLoadByType(pedestrian_tunnels);
export const promiseCreatePedestrianTunnels = geoobjectCreateByType(pedestrian_tunnels);
export const promiseUpdatePedestrianTunnels = (formState: PedestrianTunnels) => {
  const payload = {
    ...formState,
  };

  return GeozonePedestrianTunnelsService.put(payload, false, 'json');
};
export const promiseRemovePedestrianTunnels = geoobjectRemoveByType(pedestrian_tunnels);
