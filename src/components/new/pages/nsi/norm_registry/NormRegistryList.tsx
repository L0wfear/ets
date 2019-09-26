import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import NormRegistryFormLazy from 'components/new/pages/nsi/norm_registry/form';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/norm_registry/_config-data/registry-config';
import { Norm } from 'redux-main/reducers/modules/some_uniq/norm_registry/@types';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const NormRegistryList: React.FC<OwnProps> = React.memo(
  () => {
    return (
        <>
          <Registry registryKey={registryKey} />
          <NormRegistryFormLazy registryKey={registryKey} />
        </>
    );
  },
);

export default withRegistry<Norm, OwnProps>(config)(NormRegistryList);
