import { BatteryBrand } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { GetBatteryManufacturer } from 'redux-main/reducers/modules/autobase/actions_by_type/battery_manufacturer/@types';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsBatteryBrandFormLazy = {
  element: Partial<BatteryBrand>;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
};

export type StatePropsBatteryBrand = {};
export type DispatchPropsBatteryBrand = {
  autobaseGetSetBatteryManufacturer: GetBatteryManufacturer;
};
export type OwnBatteryBrandProps = {
  element: Partial<BatteryBrand>;
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
