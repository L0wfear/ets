import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import RepairCompanyFormLazy from 'components/new/pages/nsi/autobase/pages/repair_company/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/repair_company/_config-data/registry-config';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import { RepairCompany } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

type OwnProps = {};
const RepairCompanyList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <RepairCompanyFormLazy registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default withRegistry<RepairCompany, OwnProps>(getToConfig())(RepairCompanyList);
