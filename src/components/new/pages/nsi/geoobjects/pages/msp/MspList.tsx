import * as React from 'react';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import MspFormWrap from 'components/new/pages/nsi/geoobjects/pages/msp/MspForm/MspFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/msp/_config-data/registry-config';

type Props = {};

const MspList: React.FC<Props> = React.memo(
  () => {
    return (
       <React.Fragment>
        <Registry registryKey={registryKey} />
        <MspFormWrap registryKey={registryKey} />
       </React.Fragment>
    );
  },
);

export default withRegistry<any>(
  config,
)(MspList);
