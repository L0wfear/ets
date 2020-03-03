import * as React from 'react';

import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { BatteryRegistry } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

const BatteryRegistryFrom = React.lazy(() => (
  import(/* webpackChunkName: "battery_registry_form" */ 'components/new/pages/nsi/autobase/pages/battery_registry/form/BatteryRegistryForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<BatteryRegistry>, BatteryRegistry>({
  add_path: 'battery-brand',
})(BatteryRegistryFrom);
