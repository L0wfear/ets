import * as React from 'react';

import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import CompanyListFormWrap from 'components/new/pages/nsi/company/form/CompanyFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/company/_config-data/registry-config';

import { Company } from 'redux-main/reducers/modules/company/@types';

type OwnProps = {};
const CompanyList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <CompanyListFormWrap registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default withRegistry<Company, OwnProps>(
  config,
)(CompanyList);
