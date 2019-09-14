import * as React from 'react';

import { withFormRegistrySearchNew, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';
import { BatteryManufacturer } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

const BatteryManufacturerFrom = React.lazy(() => (
  import(/* webpackChunkName: "battery_manufacturer_form" */ 'components/new/pages/nsi/autobase/pages/battery_manufacturer/form/BatteryManufacturerForm')
));

export default withFormRegistrySearchNew<WithFormRegistrySearchProps<BatteryManufacturer>, BatteryManufacturer>({
  add_path: 'battery-brand',
})(BatteryManufacturerFrom);
