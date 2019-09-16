import * as React from 'react';
import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { Ssp } from 'redux-main/reducers/modules/geoobject/actions_by_type/ssp/@types';

const SspFrom = React.lazy(() => (
  import(/* webpackChunkName: "ssp_form" */ 'components/new/pages/nsi/geoobjects/pages/ssp/SspForm/SspForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<Ssp>, Ssp>({
  add_path: 'ssp',
})(SspFrom);
