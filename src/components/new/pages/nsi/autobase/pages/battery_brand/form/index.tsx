import * as React from 'react';

import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { BatteryBrand } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

const BatteryBrandFrom = React.lazy(() => (
  import(/* webpackChunkName: "battery_brand_form" */ 'components/new/pages/nsi/autobase/pages/battery_brand/form/BatteryBrandForm')
));

type OwnProps = WithFormRegistrySearchProps<BatteryBrand>;

export default withFormRegistrySearch<OwnProps, BatteryBrand>({
  add_path: 'battery_brand',
})(BatteryBrandFrom);
