import {
  FuelRate,
} from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { HandleThunkActionCreator } from 'react-redux';
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

export type OnFormHideType = (isSubmited: boolean, result?: any) => void;

export type PropsFuelRateFormLazy = {
  element: Partial<FuelRate>;
  onFormHide: OnFormHideType;

  registryKey?: string;
  page?: string;
  path?: string;
};

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
export type OwnFuelRateProps = {
  element: Partial<FuelRate>;
  handleHide: OnFormHideType;

  page: string;
  path?: string;
};

export type PropsFuelRateWithForm = StatePropsFuelRate &
  DispatchPropsFuelRate &
  OwnFuelRateProps;

export type PropsFuelRate = OutputWithFormProps<
  PropsFuelRateWithForm,
  FuelRate,
  [FuelRate],
  any
>;
