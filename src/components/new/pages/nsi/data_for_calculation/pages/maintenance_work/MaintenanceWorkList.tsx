import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import MaintenanceWorkFormLazy from 'components/new/pages/nsi/data_for_calculation/pages/maintenance_work/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/data_for_calculation/pages/maintenance_work/_config-data/registry-config';

import { MaintenanceWork } from 'redux-main/reducers/modules/some_uniq/maintenance_work/@types';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const MaintenanceWorkList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <MaintenanceWorkFormLazy registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<MaintenanceWork, OwnProps>(getToConfig())(MaintenanceWorkList);
