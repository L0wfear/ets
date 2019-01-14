import { BatteryManufacturer } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import {
  AutobaseCreateBatteryManufacturer,
  AutobaseUpdateBatteryManufacturer,
} from 'redux-main/reducers/modules/autobase/actions_by_type/battery_manufacturer/@types';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';

export type OnFormHideType = (isSubmited: boolean, result?: any) => void;

export type PropsBatteryManufacturerFormWrap = {
  showForm: boolean;
  element: BatteryManufacturer | null;
  onFormHide: OnFormHideType

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsBatteryManufacturer = {};
export type DispatchPropsBatteryManufacturer = {
  createAction: AutobaseCreateBatteryManufacturer;
  updateAction: AutobaseUpdateBatteryManufacturer;
};
export type OwnBatteryManufacturerProps = {
  element: BatteryManufacturer | null;
  handleHide: OnFormHideType
  page?: string;
  path?: string;
};

export type PropsBatteryManufacturerWithForm = (
  StatePropsBatteryManufacturer
  & DispatchPropsBatteryManufacturer
  & OwnBatteryManufacturerProps
);

export type PropsBatteryManufacturer = OutputWithFormProps<
  PropsBatteryManufacturerWithForm,
  BatteryManufacturer,
  [ BatteryManufacturer ],
  any
>;
export type StateBatteryManufacturer = {
};
