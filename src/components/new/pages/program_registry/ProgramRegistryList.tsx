import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import ProgramRegistryFormLazy from 'components/new/pages/program_registry/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/program_registry/_config-data/registry-config';
import { ProgramRegistry } from 'redux-main/reducers/modules/repair/program_registry/@types/programRegistry';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const ProgramRegistryList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <ProgramRegistryFormLazy registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<ProgramRegistry, OwnProps>(getToConfig())(ProgramRegistryList);
