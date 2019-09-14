import * as React from 'react';
import { withFormRegistrySearchNew, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';
import { Norm } from 'redux-main/reducers/modules/norm_registry/@types';

const NormFrom = React.lazy(() => (
  import(/* webpackChunkName: "norm_form" */ 'components/new/pages/nsi/norm_registry/form/NormForm')
));

export default withFormRegistrySearchNew<WithFormRegistrySearchProps<Norm>, Norm>({
  add_path: 'norm',
})(NormFrom);
