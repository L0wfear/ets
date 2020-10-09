import * as React from 'react';

import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { TachographRepair } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_repair/@types';

const TachographRepairFrom = React.lazy(() => (
  import(/* webpackChunkName: "tachograph_repair_form" */ 'components/new/pages/nsi/autobase/pages/tachograph_repair/form/TachographRepairForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<TachographRepair>, TachographRepair>({
  add_path: 'tachograph_repair',
})(TachographRepairFrom);
