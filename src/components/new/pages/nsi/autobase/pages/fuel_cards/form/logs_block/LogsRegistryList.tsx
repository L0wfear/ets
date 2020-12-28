import * as React from 'react';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import Registry from 'components/new/ui/registry/components/Registry';
import {
  registryKey,
  getToConfig,
} from './_config-data/registry-config';

const LogsRegistryList: React.FC<{id: number; setIsDataAdded: React.Dispatch<React.SetStateAction<boolean>>;}> = React.memo(
  ({id, setIsDataAdded}) => {
    const dispatch = etsUseDispatch();

    React.useEffect(
      () => {
        dispatch(registryAddInitialData(getToConfig(id)));
        setIsDataAdded(true);
        return () => {
          dispatch(registryRemoveData(registryKey));
          setIsDataAdded(false);
        };
      },
      [],
    );
    return (
      <Registry registryKey={registryKey} />
    );
  },
);

export default LogsRegistryList;