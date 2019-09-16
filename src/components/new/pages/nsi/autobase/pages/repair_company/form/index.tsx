import * as React from 'react';

import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { RepairCompany } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

const RepairCompanyFrom = React.lazy(() => (
  import(/* webpackChunkName: "repair_company_form" */ 'components/new/pages/nsi/autobase/pages/repair_company/form/RepairCompanyForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<RepairCompany>, RepairCompany>({
  add_path: 'bridges',
})(RepairCompanyFrom);
