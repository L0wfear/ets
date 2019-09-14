import * as React from 'react';
import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { FuelingWater } from 'redux-main/reducers/modules/geoobject/actions_by_type/fueling_water/@types';

const FuelingWaterFrom = React.lazy(() => (
  import(/* webpackChunkName: "FuelingWater_form" */ 'components/new/pages/nsi/geoobjects/pages/fueling_water/FuelingWaterForm/FuelingWaterForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<FuelingWater>, FuelingWater>({
  add_path: 'FuelingWater',
})(FuelingWaterFrom);
