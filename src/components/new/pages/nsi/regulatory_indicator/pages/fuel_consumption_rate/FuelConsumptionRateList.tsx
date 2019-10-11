import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import FuelRatesFormLazy from 'components/new/pages/nsi/regulatory_indicator/pages/fuel_consumption_rate/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/regulatory_indicator/pages/fuel_consumption_rate/_config-data/registry-config';
import { FuelRate } from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const FuelRatesList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <FuelRatesFormLazy registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<FuelRate, OwnProps>(getToConfig())(FuelRatesList);
