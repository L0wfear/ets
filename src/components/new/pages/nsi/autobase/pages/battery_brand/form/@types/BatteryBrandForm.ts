import { BatteryBrand } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type PropsBatteryBrandWithForm = WithFormRegistrySearchAddProps<BatteryBrand>;

export type PropsBatteryBrand = OutputWithFormProps<
  PropsBatteryBrandWithForm,
  BatteryBrand,
  [ BatteryBrand ],
  any
>;
