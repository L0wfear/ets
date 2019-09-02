import * as React from 'react';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import PedestrianTunnelExitsFormWrap from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnel_exits/PedestrianTunnelExitsForm/PedestrianTunnelExitsFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnel_exits/_config-data/registry-config';

type Props = {};

const PedestrianTunnelExitsList: React.FC<Props> = React.memo(
  () => {
    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <PedestrianTunnelExitsFormWrap registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default withRegistry<any>(
  config,
)(PedestrianTunnelExitsList);
