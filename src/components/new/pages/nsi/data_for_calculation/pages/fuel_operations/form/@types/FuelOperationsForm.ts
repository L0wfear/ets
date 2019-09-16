import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { FuelOperationActive } from 'redux-main/reducers/modules/fuel_operations/@types/fuelOperations';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type PropsFuelOperationsWithForm = WithFormRegistrySearchAddProps<FuelOperationActive>;

export type PropsFuelOperations = OutputWithFormProps<
  PropsFuelOperationsWithForm,
  FuelOperationActive,
  [ FuelOperationActive ],
  any
>;
