import * as React from 'react';
import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { MaterialConsumptionRate } from 'redux-main/reducers/modules/material_consumption_rate/@types/materialConsumptionRate.h';

const MaterialConsumptionRateForm = React.lazy(() => (
  import(/* webpackChunkName: "material_consumption_rate_form" */ 'components/new/pages/nsi/regulatory_indicator/pages/material_consumption_rate/form/MaterialConsumptionRateForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<MaterialConsumptionRate>, MaterialConsumptionRate>({
  add_path: 'consumption-rate',
})(MaterialConsumptionRateForm);
