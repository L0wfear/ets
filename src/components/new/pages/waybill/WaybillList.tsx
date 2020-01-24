import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryWaybillKey,
  config,
} from 'components/new/pages/waybill/_config-data/registry-config';

import WaybilFormlLazy from 'components/new/pages/waybill/form';

import { WaybillRegistryRow } from 'redux-main/reducers/modules/waybill/@types';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const WaybillList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryWaybillKey}>
        <WaybilFormlLazy registryKey={registryWaybillKey} />
      </Registry>
    );
  },
);

export default withRegistry<WaybillRegistryRow, OwnProps>(config)(WaybillList);
