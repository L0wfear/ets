import * as React from 'react';
import { withFormRegistrySearchNew, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';
import { FuelRate } from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';

// const FuelRateForm = enhanceWithPermissions(BaseFuelRateForm);

const FuelRateForm = React.lazy(() => (
  import(/* webpackChunkName: "fuel_consumption_rate_from" */ 'components/new/pages/nsi/regulatory_indicator/pages/fuel_consumption_rate/form/FuelFonsumptionRateForm')
));

export default withFormRegistrySearchNew<WithFormRegistrySearchProps<FuelRate>, FuelRate>({
  add_path: 'fuel-rate',
})(FuelRateForm);
