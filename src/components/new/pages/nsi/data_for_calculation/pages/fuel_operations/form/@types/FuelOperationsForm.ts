import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { FuelOperationActive } from 'redux-main/reducers/modules/fuel_operations/@types/fuelOperations';
import { HandleThunkActionCreator } from 'react-redux';
import { actionLoadMeasureUnit } from 'redux-main/reducers/modules/some_uniq/measure_unit/actions';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsFuelOperationsFormLazy = {
  element: Partial<FuelOperationActive>;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
};

export type StatePropsFuelOperations = {};
export type DispatchPropsFuelOperations = {
  actionLoadMeasureUnit: HandleThunkActionCreator<typeof actionLoadMeasureUnit>;
};
export type OwnFuelOperationsProps = {
  element: Partial<FuelOperationActive>;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsFuelOperationsWithForm = (
  StatePropsFuelOperations
  & DispatchPropsFuelOperations
  & OwnFuelOperationsProps
);

export type PropsFuelOperations = OutputWithFormProps<
  PropsFuelOperationsWithForm,
  FuelOperationActive,
  [ FuelOperationActive ],
  any
>;
