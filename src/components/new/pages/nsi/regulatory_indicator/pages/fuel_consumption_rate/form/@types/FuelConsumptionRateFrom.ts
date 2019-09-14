import { HandleThunkActionCreator } from 'react-redux';
import {
  FuelRate,
} from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { getSomeUniqSpecialModelOptions } from 'redux-main/reducers/modules/some_uniq/special_model/selectors';
import { getModelsListOptions } from 'redux-main/reducers/modules/some_uniq/modelList/selectors';
import { getFuelRateOperationsIsActiveOptions } from 'redux-main/reducers/modules/fuel_rates/selectors';

import {
  fuelOperationsGetAndSetInStore,
  resetFuelOperations,
} from 'redux-main/reducers/modules/fuel_rates/actions-fuelRates';
import { getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';
import { FuelOperation } from 'redux-main/reducers/modules/fuel_operations/@types/fuelOperations';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';

export type StatePropsFuelRate = {
  STRUCTURES: ReturnType<typeof getSessionStructuresOptions>;
  modelsList: IStateSomeUniq['modelsList'];
  fuelRateOperationsIsActiveList?: FuelOperation[];
  specialModelOptions: ReturnType<typeof getSomeUniqSpecialModelOptions>;
  modelsListOptions: ReturnType<typeof getModelsListOptions>;
  fuelRateOperationsIsActiveOptions: ReturnType<
    typeof getFuelRateOperationsIsActiveOptions
  >;
};
export type DispatchPropsFuelRate = {
  actionGetAndSetInStoreSpecialModel: HandleThunkActionCreator<typeof someUniqActions.actionGetAndSetInStoreSpecialModel>;
  actionGetAndSetInStoreModelList: HandleThunkActionCreator<typeof someUniqActions.actionGetAndSetInStoreModelList>;
  fuelOperationsGetAndSetInStore: HandleThunkActionCreator<typeof fuelOperationsGetAndSetInStore>;
  actionResetModelList: HandleThunkActionCreator<typeof someUniqActions.actionResetModelList>;
  actionResetSpecialModel: HandleThunkActionCreator<typeof someUniqActions.actionResetSpecialModel>;
  resetFuelOperations: HandleThunkActionCreator<typeof resetFuelOperations>;
};
export type OwnFuelRateProps = WithFormRegistrySearchAddProps<FuelRate>;

export type PropsFuelRateWithForm = StatePropsFuelRate &
  DispatchPropsFuelRate &
  OwnFuelRateProps;

export type PropsFuelRate = OutputWithFormProps<
  PropsFuelRateWithForm,
  FuelRate,
  [FuelRate],
  any
>;
