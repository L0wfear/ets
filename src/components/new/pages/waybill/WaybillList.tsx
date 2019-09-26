import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryWaybillKey,
  config,
} from 'components/new/pages/waybill/_config-data/registry-config';

import WaybilFormlLazy from 'components/new/pages/waybill/form';

import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const WaybillList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <React.Fragment>
        <Registry registryKey={registryWaybillKey} />
        <WaybilFormlLazy registryKey={registryWaybillKey} />
      </React.Fragment>
    );
  },
);

export default withRegistry<Waybill, OwnProps>(config)(WaybillList);
