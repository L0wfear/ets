import * as React from 'react';

import { Company } from 'redux-main/reducers/modules/company/@types';
import { WithFormRegistrySearchProps, withFormRegistrySearchNew } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';

const CompanyFrom = React.lazy(() => (
  import(/* webpackChunkName: "company_form" */ 'components/new/pages/nsi/company/form/CompanyForm')
));

export default withFormRegistrySearchNew<WithFormRegistrySearchProps<Company>, Company>({
  add_path: 'company',
})(CompanyFrom);
