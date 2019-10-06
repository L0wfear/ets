import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import MaintenanceRateFormLazy from 'components/new/pages/nsi/regulatory_indicator/pages/maintenance_rate/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/regulatory_indicator/pages/maintenance_rate/_config-data/registry-config';

import { MaintenanceRate } from 'redux-main/reducers/modules/maintenance_rate/@types/maintenanceRate.h';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const MaintenanceRateList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <MaintenanceRateFormLazy registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<MaintenanceRate, OwnProps>(getToConfig())(MaintenanceRateList);
