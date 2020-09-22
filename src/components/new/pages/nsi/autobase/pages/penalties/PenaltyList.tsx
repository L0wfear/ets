import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import PenaltyFormLazy from 'components/new/pages/nsi/autobase/pages/penalties/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/penalties/_config-data/registry-config';
import { Penalty } from 'redux-main/reducers/modules/autobase/actions_by_type/penalties/@types';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const PenaltyList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <PenaltyFormLazy registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<Penalty, OwnProps>(getToConfig())(PenaltyList);
