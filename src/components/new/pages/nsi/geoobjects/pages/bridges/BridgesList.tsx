import * as React from 'react';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import BridgesFormWrap from 'components/new/pages/nsi/geoobjects/pages/bridges/BridgesForm/BridgesFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/bridges/_config-data/registry-config';

import {
  PropsBridgesList,
  StateBridgesList,
} from 'components/new/pages/nsi/geoobjects/pages/bridges/BridgesList.h';

class BridgesList extends React.Component<PropsBridgesList, StateBridgesList> {
  render() {
    return (
       <>
        <Registry
          registryKey={registryKey}
        />
        <BridgesFormWrap
          registryKey={registryKey}
        />
      </>
    );
  }
}

export default withRegistry(
  config,
)(BridgesList);
