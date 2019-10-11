import * as React from 'react';

import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import PedestrianTunnelsFormWrap from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnels/PedestrianTunnelsForm/PedestrianTunnelsFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnels/_config-data/registry-config';
import { PedestrianTunnels } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnels/@types';

type OwnProps = {};

const PedestrianTunnelsList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <PedestrianTunnelsFormWrap registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<PedestrianTunnels, OwnProps>(
  config,
)(PedestrianTunnelsList);
