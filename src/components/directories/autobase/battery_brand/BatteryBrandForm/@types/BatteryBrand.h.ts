import { BatteryBrand, BatteryManufacturer } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DefaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { GetBatteryManufacturer } from 'redux-main/reducers/modules/autobase/actions_by_type/battery_manufacturer/@types';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsBatteryBrandFormWrap = {
  showForm: boolean;
  element: BatteryBrand | null;
  onFormHide: OnFormHideType

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsBatteryBrand = {};
export type DispatchPropsBatteryBrand = {
  autobaseGetSetBatteryManufacturer: GetBatteryManufacturer;
};
export type OwnBatteryBrandProps = {
  element: BatteryBrand | null;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsBatteryBrandWithForm = (
  StatePropsBatteryBrand
  & DispatchPropsBatteryBrand
  & OwnBatteryBrandProps
);

export type PropsBatteryBrand = OutputWithFormProps<
  PropsBatteryBrandWithForm,
  BatteryBrand,
  [ BatteryBrand ],
  any
>;
export type StateBatteryBrand = {
  batteryManufacturerOptions: DefaultSelectListMapper<BatteryManufacturer>;
};
