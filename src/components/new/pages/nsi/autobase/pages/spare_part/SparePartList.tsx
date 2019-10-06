import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import SparePartFormLazy from 'components/new/pages/nsi/autobase/pages/spare_part/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/spare_part/_config-data/registry-config';
import { SparePart } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const SparePartList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <SparePartFormLazy registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<SparePart, OwnProps>(getToConfig())(SparePartList);
