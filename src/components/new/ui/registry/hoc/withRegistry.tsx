import * as React from 'react';

import {
  registryAddInitialData,
  registryRemoveData,
} from 'components/new/ui/registry/module/actions-registy';

import {
  TypeConfigData,
} from 'components/new/ui/registry/module/@types/registry';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

const withRegistry = <F extends any, OwnProps extends any>(configData: TypeConfigData<F>) => (Component: React.ComponentType<OwnProps>) => {
  const RegistryWrap: React.FC<OwnProps> = React.memo(
    (props) => {
      const dispatch = etsUseDispatch();
      React.useEffect(
        () => {
          dispatch(registryAddInitialData(configData));

          return () => {
            dispatch(registryRemoveData(configData.registryKey));
          };
        },
        [],
      );
      return (
        <Component {...props} />
      );
    },
  );

  return RegistryWrap;
};

export default withRegistry;
