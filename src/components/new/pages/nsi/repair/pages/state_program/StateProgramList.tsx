import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import StateProgramFormLazy from 'components/new/pages/nsi/repair/pages/state_program/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/repair/pages/state_program/_config-data/registry-config';
import { StateProgram } from 'redux-main/reducers/modules/repair/state_program/@types/stateProgram';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const StateProgramList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <StateProgramFormLazy registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default withRegistry<StateProgram, OwnProps>(getToConfig())(StateProgramList);
