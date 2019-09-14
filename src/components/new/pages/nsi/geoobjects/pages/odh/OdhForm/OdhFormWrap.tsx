import * as React from 'react';
import { withFormRegistrySearchNew, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';
import { Odh } from 'redux-main/reducers/modules/geoobject/actions_by_type/odh/@types';

const OdhFrom = React.lazy(() => (
  import(/* webpackChunkName: "odh_form" */ 'components/new/pages/nsi/geoobjects/pages/odh/OdhForm/OdhForm')
));

export default withFormRegistrySearchNew<WithFormRegistrySearchProps<Odh>, Odh>({
  add_path: 'odh',
})(OdhFrom);
