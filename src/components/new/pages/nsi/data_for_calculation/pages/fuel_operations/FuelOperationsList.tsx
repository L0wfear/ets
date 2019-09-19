import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import FuelOperationsFormLazy from 'components/new/pages/nsi/data_for_calculation/pages/fuel_operations/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/data_for_calculation/pages/fuel_operations/_config-data/registry-config';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type Props = {};

const FuelOperationsList: React.FC<Props> = React.memo(
  () => {
    const dispatch = etsUseDispatch();
    React.useEffect(
      () => {
        dispatch(registryAddInitialData(getToConfig()));
        return () => {
          dispatch(registryRemoveData(registryKey));
        };
      },
      [],
    );

    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <FuelOperationsFormLazy registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default withPreloader<{}>({
  page: registryKey,
  typePreloader: 'mainpage',
})(FuelOperationsList);
