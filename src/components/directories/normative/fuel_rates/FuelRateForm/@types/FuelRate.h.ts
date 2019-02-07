import { FuelRate, FuelOperation } from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { HandleThunkActionCreator } from 'react-redux';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import {
  getSomeUniqSpecialModelOptions,
} from 'redux-main/reducers/modules/some_uniq/special_model/selectors';
import {
  getModelsListOptions
} from 'redux-main/reducers/modules/some_uniq/modelList/selectors';
import { getCompanyStructureLinearOptions } from 'redux-main/reducers/modules/company_structure/selectors';
import { getFuelRateOperationsIsActiveOptions } from 'redux-main/reducers/modules/fuel_rates/selectors';
import companyStructureActions from 'redux-main/reducers/modules/company_structure/actions';
import {
  fuelOperationsGetAndSetInStore,
  resetFuelOperations,
} from 'redux-main/reducers/modules/fuel_rates/actions-fuelRates';

export type OnFormHideType = (isSubmited: boolean, result?: any) => void;

export type PropsFuelRateFormWrap = {
  showForm: boolean;
  element: FuelRate | null;
  onFormHide: OnFormHideType;

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsFuelRate = {
  modelsList: IStateSomeUniq['modelsList'];
  fuelRateOperationsIsActiveList?: FuelOperation[];
  specialModelOptions: ReturnType<typeof getSomeUniqSpecialModelOptions>;
  companyStructureLinearOptions: ReturnType<typeof getCompanyStructureLinearOptions>;
  modelsListOptions: ReturnType<typeof getModelsListOptions>;
  fuelRateOperationsIsActiveOptions: ReturnType<typeof getFuelRateOperationsIsActiveOptions>;
};
export type DispatchPropsFuelRate = {
  actionGetAndSetInStoreSpecialModel: HandleThunkActionCreator<typeof someUniqActions.actionGetAndSetInStoreSpecialModel>;
  getAndSetInStoreCompanyStructureLinear: HandleThunkActionCreator<typeof companyStructureActions.getAndSetInStoreCompanyStructureLinear>;
  actionGetAndSetInStoreModelList: HandleThunkActionCreator<typeof someUniqActions.actionGetAndSetInStoreModelList>;
  fuelOperationsGetAndSetInStore: HandleThunkActionCreator<typeof fuelOperationsGetAndSetInStore>;
  actionResetModelList: HandleThunkActionCreator<typeof someUniqActions.actionResetModelList>;
  actionResetSpecialModel: HandleThunkActionCreator<typeof someUniqActions.actionResetSpecialModel>;
  resetSetCompanyStructureLinear: HandleThunkActionCreator<typeof companyStructureActions.resetSetCompanyStructureLinear>;
  resetFuelOperations: HandleThunkActionCreator<typeof resetFuelOperations>;
};
export type OwnFuelRateProps = { // fuelRateForm props
  element: FuelRate | null;
  handleHide: OnFormHideType;
  page: string;
  path?: string;
};

export type PropsFuelRateWithForm = (
  StatePropsFuelRate
  & DispatchPropsFuelRate
  & OwnFuelRateProps
);

export type PropsFuelRate = OutputWithFormProps<
  PropsFuelRateWithForm,
  FuelRate,
  [ FuelRate ],
  any
>;
export type StateFuelRate = {
};
