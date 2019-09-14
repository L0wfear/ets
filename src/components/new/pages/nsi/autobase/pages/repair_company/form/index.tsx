import * as React from 'react';

import { withFormRegistrySearchNew, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';
import { RepairCompany } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

const RepairCompanyFrom = React.lazy(() => (
  import(/* webpackChunkName: "repair_company_form" */ 'components/new/pages/nsi/autobase/pages/repair_company/form/RepairCompanyForm')
));

export default withFormRegistrySearchNew<WithFormRegistrySearchProps<RepairCompany>, RepairCompany>({
  add_path: 'bridges',
})(RepairCompanyFrom);
