import * as React from 'react';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import BridgesFormWrap from 'components/new/pages/nsi/geoobjects/pages/bridges/BridgesForm/BridgesFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/bridges/_config-data/registry-config';

type Props = {};

const BridgesList: React.FC<Props> = React.memo(
  () => {
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
  },
);

export default withRegistry<any>(
  config,
)(BridgesList);
