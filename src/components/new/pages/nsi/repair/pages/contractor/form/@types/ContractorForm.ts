import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { Contractor } from 'redux-main/reducers/modules/repair/contractor/@types/contractor';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type PropsContractorWithForm = WithFormRegistrySearchAddProps<Contractor>;

export type PropsContractor = OutputWithFormProps<
  PropsContractorWithForm,
  Contractor,
  [ Contractor ],
  any
>;
