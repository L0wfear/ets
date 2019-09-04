import * as React from 'react';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import PedestrianTunnelsFormWrap from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnels/PedestrianTunnelsForm/PedestrianTunnelsFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnels/_config-data/registry-config';

type Props = {};

const PedestrianTunnelsList: React.FC<Props> = React.memo(
  () => {
    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <PedestrianTunnelsFormWrap registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default withRegistry<any>(
  config,
)(PedestrianTunnelsList);
