import { ReduxState } from 'redux-main/@types/state';
import { createSelector, Selector } from 'reselect';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';
import { IStateFuelRates } from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';
import { getFuelRatesState } from 'redux-main/reducers/selectors';

// for reselect
export type FuelRateOperationsIsActiveStructure = ValuesOf<IStateFuelRates['fuelRateOperationsIsActiveList']>;

export type GetSessionModelListOptionsAns = (
  DefaultSelectOption<FuelRateOperationsIsActiveStructure['id'], FuelRateOperationsIsActiveStructure['name'], FuelRateOperationsIsActiveStructure>[]
);

export const getFuelRateOperationsIsActive: Selector<ReduxState, IStateFuelRates['fuelRateOperationsIsActiveList']> = (state) => (
  getFuelRatesState(state).fuelRateOperationsIsActiveList
);

export const getFuelRateOperationsIsActiveOptions = createSelector<ReduxState, IStateFuelRates['fuelRateOperationsIsActiveList'], GetSessionModelListOptionsAns>(
  getFuelRateOperationsIsActive,
  (fuelRateOperationsList) => fuelRateOperationsList.map((op) => ({
    value: op.id,
    label: `${op.name}, ${op.measure_unit_name}${op.equipment ? ' [спецоборудование]' : ''}${op.is_excluding_mileage ? '[без учета пробега]' : ''}`,
    rowData: op,
  }))
  .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase())),
);
