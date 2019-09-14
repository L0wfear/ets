import * as React from 'react';
import { WithFormRegistrySearchProps, withFormRegistrySearchNew } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';
import { Msp } from 'redux-main/reducers/modules/geoobject/actions_by_type/msp/@types';

const MspFrom = React.lazy(() => (
  import(/* webpackChunkName: "msp_form" */ 'components/new/pages/nsi/geoobjects/pages/msp/MspForm/MspForm')
));

export default withFormRegistrySearchNew<WithFormRegistrySearchProps<Msp>, Msp>({
  add_path: 'msp',
})(MspFrom);
