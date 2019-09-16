import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { CleaningRate } from 'redux-main/reducers/modules/cleaning_rate/@types/cleaningRate';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type PropsCleaningRateWithForm = WithFormRegistrySearchAddProps<CleaningRate>;

export type PropsCleaningRate = OutputWithFormProps<
  PropsCleaningRateWithForm,
  CleaningRate,
  [ CleaningRate ],
  any
>;
