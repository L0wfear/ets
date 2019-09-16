import * as React from 'react';
import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { DangerZone } from 'redux-main/reducers/modules/geoobject/actions_by_type/danger_zone/@types';

const DangerZoneFrom = React.lazy(() => (
  import(/* webpackChunkName: "DangerZone_form" */ 'components/new/pages/nsi/geoobjects/pages/danger_zone/DangerZoneForm/DangerZoneForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<DangerZone>, DangerZone>({
  add_path: 'DangerZone',
})(DangerZoneFrom);
