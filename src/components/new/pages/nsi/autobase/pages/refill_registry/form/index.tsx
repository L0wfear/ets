import * as React from 'react';
import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { Refill } from 'redux-main/reducers/modules/autobase/actions_by_type/refill_registry/@types';

const RefillFrom = React.lazy(() => (
  import(/* webpackChunkName: "refill_form" */ 'components/new/pages/nsi/autobase/pages/refill_registry/form/RefillForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<Refill>, Refill>({
  add_path: 'refill',
})(RefillFrom);
