import * as React from 'react';
import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { Norm } from 'redux-main/reducers/modules/some_uniq/norm_registry/@types';

const NormFormContextReactLazy = React.lazy(() => (
  import(/* webpackChunkName: "norm_form" */ 'components/new/pages/nsi/norm_registry/form/NormFormContext')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<Norm>, Norm>({
  add_path: 'norm',
})(NormFormContextReactLazy);
