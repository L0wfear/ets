import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import CleaningRateFormLazy from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_rate/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_rate/_config-data/registry-config';
import { CleaningRate } from 'redux-main/reducers/modules/cleaning_rate/@types/cleaningRate';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const CleaningRateList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <CleaningRateFormLazy registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<CleaningRate, OwnProps>(getToConfig())(CleaningRateList);
