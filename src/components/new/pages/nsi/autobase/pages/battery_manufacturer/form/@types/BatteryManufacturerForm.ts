import { BatteryManufacturer } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type PropsBatteryManufacturerWithForm = WithFormRegistrySearchAddProps<BatteryManufacturer>;

export type PropsBatteryManufacturer = OutputWithFormProps<
  PropsBatteryManufacturerWithForm,
  BatteryManufacturer,
  [ BatteryManufacturer ],
  any
>;
