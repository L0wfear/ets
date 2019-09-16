import * as React from 'react';
import { Dt } from 'redux-main/reducers/modules/geoobject/actions_by_type/dt/@types';
import { WithFormRegistrySearchProps, withFormRegistrySearch } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const DtFrom = React.lazy(() => (
  import(/* webpackChunkName: "dt_form" */ 'components/new/pages/nsi/geoobjects/pages/dt/DtForm/DtForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<Dt>, Dt>({
  add_path: 'dt',
})(DtFrom);
