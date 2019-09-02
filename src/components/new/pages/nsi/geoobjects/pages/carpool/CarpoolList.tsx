import * as React from 'react';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import CarpoolFormWrap from 'components/new/pages/nsi/geoobjects/pages/carpool/form/CarpoolFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/carpool/_config-data/registry-config';

type Props = {};

const CarpoolList: React.FC<Props> = React.memo(
  () => {
    return (
       <React.Fragment>
        <Registry registryKey={registryKey} />
        <CarpoolFormWrap registryKey={registryKey} />
       </React.Fragment>
    );
  },
);

export default withRegistry(
  config,
)(CarpoolList);
