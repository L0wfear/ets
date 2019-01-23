import * as React from 'react';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import PedestrianTunnelsFormWrap from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnels/PedestrianTunnelsForm/PedestrianTunnelsFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnels/_config-data/registry-config';

import {
  PropsPedestrianTunnelsList,
  StatePedestrianTunnelsList,
} from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnels/PedestrianTunnelsList.h';

class PedestrianTunnelsList extends React.Component<PropsPedestrianTunnelsList, StatePedestrianTunnelsList> {
  render() {
    return (
       <>
        <Registry
          registryKey={registryKey}
        />
        <PedestrianTunnelsFormWrap
          registryKey={registryKey}
        />
      </>
    );
  }
}

export default withRegistry<any>(
  config,
)(PedestrianTunnelsList);
