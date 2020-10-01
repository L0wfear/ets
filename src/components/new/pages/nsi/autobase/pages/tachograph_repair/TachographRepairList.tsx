import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import TachographRepairFormFormLazy from 'components/new/pages/nsi/autobase/pages/tachograph_repair/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/tachograph_repair/_config-data/registry-config';
import { TachographRepairList } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_repair/@types';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const TachographRepair: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <TachographRepairFormFormLazy registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<TachographRepairList, OwnProps>(getToConfig())(TachographRepair);
