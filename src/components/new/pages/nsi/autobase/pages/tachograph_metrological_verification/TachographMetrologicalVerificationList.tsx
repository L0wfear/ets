import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import TachographMetrologicalVerificationLazy from 'components/new/pages/nsi/autobase/pages/tachograph_metrological_verification/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/tachograph_metrological_verification/_config-data/registry-config';
import { TachographMetrologicalVerificationList } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_metrological_verification/@types';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const TachographMetrologicalVerification: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <TachographMetrologicalVerificationLazy registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<TachographMetrologicalVerificationList, OwnProps>(getToConfig())(TachographMetrologicalVerification);
