import { FuelRateUpd, fuelOperation } from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { IStateCompanyStructure } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';

export type OnFormHideType = (isSubmited: boolean, result?: any) => void;

export type PropsFuelRateFormWrap = {
  showForm: boolean;
  element: FuelRateUpd | null;
  onFormHide: OnFormHideType;

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsFuelRate = {
  modelsList: IStateSomeUniq['modelsList'];
  fuelRateOperationsIsActiveList?: fuelOperation[];
  specialModelList: IStateSomeUniq['specialModelList'];
  companyStructureLinearList: IStateCompanyStructure['companyStructureLinearList'];
};
export type DispatchPropsFuelRate = {
  createAction: any; // поменять any !!
  updateAction: any; // поменять any !!
  actionGetAndSetInStoreSpecialModel: any;
  getAndSetInStoreCompanyStructureLinear: any;
  actionGetAndSetInStoreModelList: any;
  FuelOperationsIsActiveGet: any;
};
export type OwnFuelRateProps = { // fuelRateForm props
  element: FuelRateUpd | null;
  handleHide: OnFormHideType;
  page?: string;
  path?: string;
};

export type PropsFuelRateWithForm = (
  StatePropsFuelRate
  & DispatchPropsFuelRate
  & OwnFuelRateProps
);

export type PropsFuelRate = OutputWithFormProps<
  PropsFuelRateWithForm,
  FuelRateUpd,
  [ FuelRateUpd ],
  any
>;
export type StateFuelRate = {
};
