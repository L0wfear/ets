import * as React from 'react';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import FuelingWaterFormWrap from 'components/new/pages/nsi/geoobjects/pages/fueling_water/FuelingWaterForm/FuelingWaterFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/fueling_water/_config-data/registry-config';

type Props = {};

const FuelingWaterList: React.FC<Props> = React.memo(
  () => {
    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <FuelingWaterFormWrap registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default withRegistry<any>(
  config,
)(FuelingWaterList);
