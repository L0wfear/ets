import { BatteryRegistry, BatteryBrand } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import {
  AutobaseCreateBatteryRegistry,
  AutobaseUpdateBatteryRegistry,
} from 'redux-main/reducers/modules/autobase/actions_by_type/battery_registry/@types';
import { GetBatteryBrand } from 'redux-main/reducers/modules/autobase/actions_by_type/battery_brand/@types';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsBatteryRegistryFormWrap = {
  showForm: boolean;
  element: BatteryRegistry | null;
  onFormHide: OnFormHideType

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsBatteryRegistry = {};
export type DispatchPropsBatteryRegistry = {
  createAction: AutobaseCreateBatteryRegistry;
  updateAction: AutobaseUpdateBatteryRegistry;
  autobaseGetSetBatteryBrand: GetBatteryBrand;
};
export type OwnBatteryRegistryProps = {
  element: BatteryRegistry | null;
  handleHide: OnFormHideType
  page?: string;
  path?: string;
};

export type PropsBatteryRegistryWithForm = (
  StatePropsBatteryRegistry
  & DispatchPropsBatteryRegistry
  & OwnBatteryRegistryProps
);

export type PropsBatteryRegistry = OutputWithFormProps<
  PropsBatteryRegistryWithForm,
  BatteryRegistry,
  [ BatteryRegistry ],
  any
>;
export type StateBatteryRegistry = {
  canSave: boolean;
  batteryBrandOptions: {
    value: BatteryBrand['id'];
    label: BatteryBrand['name'];
    brand_name: BatteryBrand['manufacturer_name'];
  }[];
};
