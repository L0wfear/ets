import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import ContractorFormLazy from 'components/new/pages/nsi/repair/pages/contractor/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/repair/pages/contractor/_config-data/registry-config';

import { Contractor } from 'redux-main/reducers/modules/repair/contractor/@types/contractor';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const ContractorList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <ContractorFormLazy registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default withRegistry<Contractor, OwnProps>(getToConfig())(ContractorList);
