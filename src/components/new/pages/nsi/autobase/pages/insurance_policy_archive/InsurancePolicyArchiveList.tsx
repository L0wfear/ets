import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import InsurancePolicyFormLazy from 'components/new/pages/nsi/autobase/pages/insurance_policy/form';

import {
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/insurance_policy/_config-data/registry-config';

import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import { InsurancePolicy } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const registryKey = 'insurancePolicyArchiveRegistry';
type OwnProps = {};
const InsurancePolicyAchiveList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <InsurancePolicyFormLazy registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<InsurancePolicy, OwnProps>(getToConfig(null, true, 'Архив страховок', registryKey))(InsurancePolicyAchiveList);
