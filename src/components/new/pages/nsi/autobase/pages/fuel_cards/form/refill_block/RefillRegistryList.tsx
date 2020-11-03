import * as React from 'react';
//import { get } from 'lodash';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import Registry from 'components/new/ui/registry/components/Registry';
import {
  registryKey,
  getToConfig,
} from './_config-data/registry-config';
import RefillFormLazy from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/refill_block/form';

const RefillRegistryList: React.FC = React.memo(
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
      <Registry registryKey={registryKey}>
        <RefillFormLazy 
          registryKey={registryKey} 
          page={''}
        />
      </Registry>
    );
  },
);

export default RefillRegistryList;