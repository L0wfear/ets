import * as React from 'react';

import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { TireModel } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

const TireModelFrom = React.lazy(() => (
  import(/* webpackChunkName: "tire_model_form" */ 'components/new/pages/nsi/autobase/pages/tire_model/form/TireModelForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<TireModel>, TireModel>({
  add_path: 'tire-model',
})(TireModelFrom);
