import * as React from 'react';

import { Carpool } from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/@types';
import { withFormRegistrySearchNew, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';

const CarpoolFrom = React.lazy(() => (
  import(/* webpackChunkName: "carpool_form" */ 'components/new/pages/nsi/geoobjects/pages/carpool/form/CarpoolForm')
));

export default withFormRegistrySearchNew<WithFormRegistrySearchProps<Carpool>, Carpool>({
  add_path: 'carpool',
})(CarpoolFrom);
