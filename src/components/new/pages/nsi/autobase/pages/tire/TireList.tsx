import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import TireFormLazy from 'components/new/pages/nsi/autobase/pages/tire/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/tire/_config-data/registry-config';
import { Tire } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const TireList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <TireFormLazy registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<Tire, OwnProps>(getToConfig(null))(TireList);
