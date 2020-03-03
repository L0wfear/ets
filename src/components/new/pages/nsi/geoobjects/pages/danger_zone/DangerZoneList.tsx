import * as React from 'react';

import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import DangerZoneFormWrap from 'components/new/pages/nsi/geoobjects/pages/danger_zone/DangerZoneForm/DangerZoneFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/danger_zone/_config-data/registry-config';
import { DangerZone } from 'redux-main/reducers/modules/geoobject/actions_by_type/danger_zone/@types';

type OwnProps = {};

const DangerZoneList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <DangerZoneFormWrap registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<DangerZone, OwnProps>(
  config,
)(DangerZoneList);
