import * as React from 'react';
import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { PgmStore } from 'redux-main/reducers/modules/geoobject/actions_by_type/pgm_store/@types';

const PgmStoreFrom = React.lazy(() => (
  import(/* webpackChunkName: "PgmStore_form" */ 'components/new/pages/nsi/geoobjects/pages/pgm_store/PgmStoreForm/PgmStoreForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<PgmStore>, PgmStore>({
  add_path: 'PgmStore',
})(PgmStoreFrom);
