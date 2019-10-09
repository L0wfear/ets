import { BatteryRegistry, BatteryBrand } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type PropsBatteryRegistryWithForm = WithFormRegistrySearchAddProps<BatteryRegistry>;

export type PropsBatteryRegistry = OutputWithFormProps<
  PropsBatteryRegistryWithForm,
  BatteryRegistry,
  [ BatteryRegistry ],
  any
>;
export type StateBatteryRegistry = {
  batteryBrandOptions: {
    value: BatteryBrand['id'];
    label: BatteryBrand['name'];
    batteryBrand: BatteryBrand;
  }[];
};
