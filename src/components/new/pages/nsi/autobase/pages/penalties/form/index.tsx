import * as React from 'react';

import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { Penalty } from 'redux-main/reducers/modules/autobase/actions_by_type/penalties/@types';

const PenaltyFrom = React.lazy(() => (
  import(/* webpackChunkName: "penalty_form" */ 'components/new/pages/nsi/autobase/pages/penalties/form/PenaltyForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<Penalty>, Penalty>({
  add_path: 'penalties',
})(PenaltyFrom);
