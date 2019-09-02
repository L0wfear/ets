import * as React from 'react';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import DangerZoneFormWrap from 'components/new/pages/nsi/geoobjects/pages/danger_zone/DangerZoneForm/DangerZoneFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/danger_zone/_config-data/registry-config';

type Props = {};

const DangerZoneList: React.FC<Props> = React.memo(
  () => {
    return (
       <React.Fragment>
        <Registry registryKey={registryKey} />
        <DangerZoneFormWrap registryKey={registryKey} />
       </React.Fragment>
    );
  },
);

export default withRegistry<any>(
  config,
)(DangerZoneList);
