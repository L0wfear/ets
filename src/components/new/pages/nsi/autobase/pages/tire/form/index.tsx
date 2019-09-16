import * as React from 'react';

import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { Tire } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

const TireFrom = React.lazy(() => (
  import(/* webpackChunkName: "tire_form" */ 'components/new/pages/nsi/autobase/pages/tire/form/TireForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<Tire>, Tire>({
  add_path: 'tire',
})(TireFrom);
