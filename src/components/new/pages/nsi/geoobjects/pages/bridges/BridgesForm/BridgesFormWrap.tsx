import * as React from 'react';
import { withFormRegistrySearchNew, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';
import { Bridges } from 'redux-main/reducers/modules/geoobject/actions_by_type/bridges/@types';

const BridgesFrom = React.lazy(() => (
  import(/* webpackChunkName: "bridges_form" */ 'components/new/pages/nsi/geoobjects/pages/bridges/BridgesForm/BridgesForm')
));

export default withFormRegistrySearchNew<WithFormRegistrySearchProps<Bridges>, Bridges>({
  add_path: 'bridges',
})(BridgesFrom);
