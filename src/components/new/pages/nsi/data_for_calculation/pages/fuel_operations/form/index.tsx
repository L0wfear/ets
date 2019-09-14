import * as React from 'react';

import { FuelOperation } from 'redux-main/reducers/modules/fuel_operations/@types/fuelOperations';
import { WithFormRegistrySearchProps, withFormRegistrySearch } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const FuelOperationFrom = React.lazy(() => (
  import(/* webpackChunkName: "fuel_operations_form" */ 'components/new/pages/nsi/data_for_calculation/pages/fuel_operations/form/FuelOperationsForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<FuelOperation>, FuelOperation>({
  add_path: 'fuel_operation',
})(FuelOperationFrom);
