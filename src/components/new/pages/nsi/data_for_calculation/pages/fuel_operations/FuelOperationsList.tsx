import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import FuelOperationsFormLazy from 'components/new/pages/nsi/data_for_calculation/pages/fuel_operations/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/data_for_calculation/pages/fuel_operations/_config-data/registry-config';

import { FuelOperation } from 'redux-main/reducers/modules/fuel_operations/@types/fuelOperations';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const FuelOperationsList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <FuelOperationsFormLazy registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<FuelOperation, OwnProps>(getToConfig())(FuelOperationsList);
