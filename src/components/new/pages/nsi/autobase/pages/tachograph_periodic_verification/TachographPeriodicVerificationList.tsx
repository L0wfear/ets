import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import TachographPeriodicVerificationFormLazy from 'components/new/pages/nsi/autobase/pages/tachograph_periodic_verification/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/tachograph_periodic_verification/_config-data/registry-config';
import { Tachograph } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_periodic_verification/@types';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const TachographPeriodicVerificationList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <TachographPeriodicVerificationFormLazy registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<Tachograph, OwnProps>(getToConfig())(TachographPeriodicVerificationList);
