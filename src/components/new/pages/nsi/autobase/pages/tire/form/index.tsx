import * as React from 'react';

import { withFormRegistrySearchNew, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';
import { Tire } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

const TireFrom = React.lazy(() => (
  import(/* webpackChunkName: "tire_form" */ 'components/new/pages/nsi/autobase/pages/tire/form/TireForm')
));

export default withFormRegistrySearchNew<WithFormRegistrySearchProps<Tire>, Tire>({
  add_path: 'tire',
})(TireFrom);
