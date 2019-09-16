import * as React from 'react';

import { CompanyStructure } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';
import { WithFormRegistrySearchProps, withFormRegistrySearch } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const CompanyStructureForm = React.lazy(() => (
  import(/* webpackChunkName: "company_structure_form" */ 'components/new/pages/nsi/company_structure/form/CompanyStructureForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<CompanyStructure>, CompanyStructure>({
  add_path: 'company-structure',
})(CompanyStructureForm);
