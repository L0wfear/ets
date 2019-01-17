import * as React from 'react';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import FuelingWaterFormWrap from 'components/new/pages/nsi/geoobjects/pages/fueling_water/FuelingWaterForm/FuelingWaterFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/fueling_water/_config-data/registry-config';

import {
  PropsFuelingWaterList,
  StateFuelingWaterList,
} from 'components/new/pages/nsi/geoobjects/pages/fueling_water/FuelingWaterList.h';

class FuelingWaterList extends React.Component<PropsFuelingWaterList, StateFuelingWaterList> {
  render() {
    return (
       <>
        <Registry
          registryKey={registryKey}
        />
        <FuelingWaterFormWrap
          registryKey={registryKey}
        />
      </>
    );
  }
}

export default withRegistry(
  config,
)(FuelingWaterList);
