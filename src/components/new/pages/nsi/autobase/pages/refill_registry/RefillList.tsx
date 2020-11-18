import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import RefillFormLazy from 'components/new/pages/nsi/autobase/pages/refill_registry/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/refill_registry/_config-data/registry-config';
import { Refill } from 'redux-main/reducers/modules/autobase/actions_by_type/refill_registry/@types';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const RefillList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <RefillFormLazy registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<Refill, OwnProps>(getToConfig())(RefillList);
