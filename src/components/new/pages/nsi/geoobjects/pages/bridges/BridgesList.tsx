import * as React from 'react';

import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import BridgesFormWrap from 'components/new/pages/nsi/geoobjects/pages/bridges/BridgesForm/BridgesFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/bridges/_config-data/registry-config';
import { Bridges } from 'redux-main/reducers/modules/geoobject/actions_by_type/bridges/@types';

type OwnPorps = {};

const BridgesList: React.FC<OwnPorps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <BridgesFormWrap registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<Bridges, OwnPorps>(
  config,
)(BridgesList);
