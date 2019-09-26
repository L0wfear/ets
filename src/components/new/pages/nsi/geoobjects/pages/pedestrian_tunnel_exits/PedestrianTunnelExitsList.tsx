import * as React from 'react';

import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import PedestrianTunnelExitsFormWrap from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnel_exits/PedestrianTunnelExitsForm/PedestrianTunnelExitsFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnel_exits/_config-data/registry-config';
import { PedestrianTunnelExits } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnel_exits/@types';

type OwnProps = {};

const PedestrianTunnelExitsList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <PedestrianTunnelExitsFormWrap registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default withRegistry<PedestrianTunnelExits, OwnProps>(
  config,
)(PedestrianTunnelExitsList);
