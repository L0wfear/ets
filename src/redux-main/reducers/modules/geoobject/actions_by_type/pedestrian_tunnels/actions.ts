import { defaultActions } from 'redux-main/default.actions';
import { makeShape } from 'redux-main/reducers/modules/geoobject/promises';
import { geoobjectSetNewDataNew } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { PedestrianTunnels } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnels/@types';

export const actionsPedestrianTunnels = defaultActions<PedestrianTunnels>(
  'gormost/pedestrian_tunnels',
  geoobjectSetNewDataNew('pedestrianTunnelsList'),
  makeShape,
);
