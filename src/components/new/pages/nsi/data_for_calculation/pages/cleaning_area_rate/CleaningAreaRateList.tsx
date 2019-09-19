import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import CleaningAreaRateFormLazy from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_area_rate/form';
import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_area_rate/_config-data/registry-config';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

export type Props = {};

const CleaningAreaRateList: React.FC<Props> = React.memo(
  () => {
    const dispatch = etsUseDispatch();

    React.useEffect(
      () => {
        dispatch(registryAddInitialData(getToConfig()));
        return () => {
          dispatch(registryRemoveData(registryKey));
        };
      },
      [getToConfig],
    );

    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <CleaningAreaRateFormLazy registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default withPreloader<{}>({
  page: registryKey,
  typePreloader: 'mainpage',
})(CleaningAreaRateList);
