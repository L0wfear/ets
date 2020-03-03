import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import BatteryBrandFormLazy from 'components/new/pages/nsi/autobase/pages/battery_brand/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/battery_brand/_config-data/registry-config';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import { BatteryBrand } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

type OwnProps = {};
const BatteryBrandList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <BatteryBrandFormLazy registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<BatteryBrand, OwnProps>(getToConfig())(BatteryBrandList);
