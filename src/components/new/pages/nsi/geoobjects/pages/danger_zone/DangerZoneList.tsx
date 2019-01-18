import * as React from 'react';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import DangerZoneFormWrap from 'components/new/pages/nsi/geoobjects/pages/danger_zone/DangerZoneForm/DangerZoneFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/danger_zone/_config-data/registry-config';

import {
  PropsDangerZoneList,
  StateDangerZoneList,
} from 'components/new/pages/nsi/geoobjects/pages/danger_zone/DangerZoneList.h';

class DangerZoneList extends React.Component<PropsDangerZoneList, StateDangerZoneList> {
  render() {
    return (
       <>
        <Registry
          registryKey={registryKey}
        />
        <DangerZoneFormWrap
          registryKey={registryKey}
        />
      </>
    );
  }
}

export default withRegistry(
  config,
)(DangerZoneList);
