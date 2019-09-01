import { BatteryRegistry, BatteryBrand } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsBatteryRegistryFormLazy = {
  element: Partial<BatteryRegistry>;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
};

export type OwnBatteryRegistryProps = {
  element: Partial<BatteryRegistry>;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsBatteryRegistryWithForm = (
  OwnBatteryRegistryProps
  & WithSearchProps
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
    batteryBrand: BatteryBrand;
  }[];
};
