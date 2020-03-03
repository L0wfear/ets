import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import CarActualFormLazy from 'components/new/pages/nsi/autobase/pages/car_actual/form';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data/registry-config';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const CarActualList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <CarActualFormLazy registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<Car, OwnProps>(config)(CarActualList);
