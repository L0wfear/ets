import * as React from 'react';

import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { Contractor } from 'redux-main/reducers/modules/repair/contractor/@types/contractor';

const ContractorFrom = React.lazy(() => (
  import(/* webpackChunkName: "contractor_form" */ 'components/new/pages/nsi/repair/pages/contractor/form/ContractorForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<Contractor>, Contractor>({
  add_path: 'contractor',
})(ContractorFrom);
