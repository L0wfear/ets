import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import BatteryManufacturerFormLazy from 'components/new/pages/nsi/autobase/pages/battery_manufacturer/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/battery_manufacturer/_config-data/registry-config';
import { BatteryManufacturer } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const BatteryManufacturerList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <BatteryManufacturerFormLazy registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<BatteryManufacturer, OwnProps>(getToConfig())(BatteryManufacturerList);
