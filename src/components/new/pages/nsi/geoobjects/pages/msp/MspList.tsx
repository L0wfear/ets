import * as React from 'react';

import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import MspFormWrap from 'components/new/pages/nsi/geoobjects/pages/msp/MspForm/MspFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/msp/_config-data/registry-config';
import { Msp } from 'redux-main/reducers/modules/geoobject/actions_by_type/msp/@types';

type OwnProps = {};

const MspList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <MspFormWrap registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<Msp, OwnProps>(
  config,
)(MspList);
