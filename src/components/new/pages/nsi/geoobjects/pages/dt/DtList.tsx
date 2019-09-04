import * as React from 'react';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import DtListFormWrap from 'components/new/pages/nsi/geoobjects/pages/dt/DtForm/DtFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/dt/_config-data/registry-config';

type Props = {};

const DtList: React.FC<Props> = React.memo(
  () => {
    return (
       <React.Fragment>
        <Registry registryKey={registryKey} />
        <DtListFormWrap registryKey={registryKey} />
       </React.Fragment>
    );
  },
);

export default withRegistry<any>(
  config,
)(DtList);
