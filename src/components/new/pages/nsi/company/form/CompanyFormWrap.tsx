import * as React from 'react';

import { Company } from 'redux-main/reducers/modules/company/@types';
import { WithFormRegistrySearchProps, withFormRegistrySearch } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const CompanyFrom = React.lazy(() => (
  import(/* webpackChunkName: "company_form" */ 'components/new/pages/nsi/company/form/CompanyForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<Company>, Company>({
  add_path: 'company',
})(CompanyFrom);
