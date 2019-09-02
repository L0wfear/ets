import { defaultActions } from 'redux-main/default.actions';
import { makeShape } from 'redux-main/reducers/modules/geoobject/promises';
import { PedestrianTunnelExits } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnel_exits/@types';
import { geoobjectSetNewDataNew } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';

export const actionsPedestrianTunnelExits = defaultActions<PedestrianTunnelExits>(
  'gormost/pedestrian_tunnel_exits',
  geoobjectSetNewDataNew('pedestrianTunnelExitsList'),
  makeShape,
);
