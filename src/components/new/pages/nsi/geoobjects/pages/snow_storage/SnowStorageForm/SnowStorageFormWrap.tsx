import * as React from 'react';
import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { SnowStorage } from 'redux-main/reducers/modules/geoobject/actions_by_type/snow_storage/@types';

const SnowStorageFrom = React.lazy(() => (
  import(/* webpackChunkName: "SnowStorage_form" */ 'components/new/pages/nsi/geoobjects/pages/snow_storage/SnowStorageForm/SnowStorageForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<SnowStorage>, SnowStorage>({
  add_path: 'SnowStorage',
})(SnowStorageFrom);
