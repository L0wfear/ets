import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import BatteryRegistryFormLazy from 'components/new/pages/nsi/autobase/pages/battery_registry/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/battery_registry/_config-data/registry-config';
import { BatteryRegistry } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const BatteryRegistryList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <BatteryRegistryFormLazy registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<BatteryRegistry, OwnProps>(getToConfig(null))(BatteryRegistryList);
