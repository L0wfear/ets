import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { FuelingWater } from 'redux-main/reducers/modules/geoobject/actions_by_type/fueling_water/@types';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type PropsFuelingWaterFormWithForm = WithFormRegistrySearchAddProps<FuelingWater>;

export type PropsFuelingWaterForm = OutputWithFormProps<
  PropsFuelingWaterFormWithForm,
  FuelingWater,
  [ FuelingWater ],
  any
>;
export type StateFuelingWaterForm = {
};
