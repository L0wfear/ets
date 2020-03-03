import * as React from 'react';

import { FuelOperationActive } from 'redux-main/reducers/modules/fuel_operations/@types/fuelOperations';
import { WithFormRegistrySearchProps, withFormRegistrySearch } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const FuelOperationFromContextReactLazy = React.lazy(() => (
  import(/* webpackChunkName: "fuel_operations_form" */ 'components/new/pages/nsi/data_for_calculation/pages/fuel_operations/form/FuelOperationsFormContext')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<FuelOperationActive>, FuelOperationActive>({
  add_path: 'fuel_operations',
})(FuelOperationFromContextReactLazy);
