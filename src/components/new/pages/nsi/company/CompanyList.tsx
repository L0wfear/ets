import * as React from 'react';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import CompanyListFormWrap from 'components/new/pages/nsi/company/form/CompanyFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/company/_config-data/registry-config';

import {
  PropsCompanyList,
  StateCompanyList,
} from 'components/new/pages/nsi/company/CompanyList.h';

class CompanyList extends React.Component<PropsCompanyList, StateCompanyList> {
  render() {
    return (
       <>
        <Registry
          registryKey={registryKey}
        />
        <CompanyListFormWrap
          registryKey={registryKey}
        />
      </>
    );
  }
}

export default withRegistry<any>(
  config,
)(CompanyList);
