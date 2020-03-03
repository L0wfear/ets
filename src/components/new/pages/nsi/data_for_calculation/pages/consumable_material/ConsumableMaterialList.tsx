import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import ConsumableMaterialFormLazy from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/_config-data/registry-config';
import { ConsumableMaterialWrap } from 'redux-main/reducers/modules/consumable_material/@types/consumableMaterial';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const ConsumableMaterialList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <ConsumableMaterialFormLazy registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<ConsumableMaterialWrap, OwnProps>(getToConfig())(ConsumableMaterialList);
