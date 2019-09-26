import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import CleaningAreaRateFormLazy from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_area_rate/form';
import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_area_rate/_config-data/registry-config';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import { CleaningAreaRate } from 'redux-main/reducers/modules/cleaning_area_rate/@types/cleaningAreaRate';

type OwnProps = {};

const CleaningAreaRateList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <CleaningAreaRateFormLazy registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default withRegistry<CleaningAreaRate, OwnProps>(getToConfig())(CleaningAreaRateList);
