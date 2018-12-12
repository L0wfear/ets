import { FuelRateUpd } from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';
// import {
//   AutobaseCreateBatteryManufacturer,
//   AutobaseUpdateBatteryManufacturer,
// } from 'redux-main/reducers/modules/autobase/actions_by_type/battery_manufacturer/@types';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';

export type OnFormHideType = (isSubmited: boolean, result?: any) => void;

export type PropsFuelRateFormWrap = {
  showForm: boolean;
  element: FuelRateUpd | null;
  onFormHide: OnFormHideType;

  modelsList: any[];
  loadingPageName?: string;
  page?: string;
  path?: string;
  measureUnitList: any[];
};

export type StatePropsFuelRate = {};
export type DispatchPropsFuelRate = {
  createAction: any;
  updateAction: any;
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
  companyStructureList: any[];
  modelsList: any[];
  specialModelsList: any[];
  isPermitted: boolean;
};
