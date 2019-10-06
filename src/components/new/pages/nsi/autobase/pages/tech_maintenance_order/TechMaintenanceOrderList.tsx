import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import TechMaintenanceOrderFormLazy from 'components/new/pages/nsi/autobase/pages/tech_maintenance_order/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/tech_maintenance_order/_config-data/registry-config';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import { TechMaintOrder } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

type OwnProps = {};
const TechMaintenanceOrderList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <TechMaintenanceOrderFormLazy registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<TechMaintOrder, OwnProps>(getToConfig())(TechMaintenanceOrderList);
