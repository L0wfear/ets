import { CarFuncTypes } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type PropsCarFuncTypesWithForm = WithFormRegistrySearchAddProps<CarFuncTypes>;

export type PropsCarFuncTypes = OutputWithFormProps<
  PropsCarFuncTypesWithForm,
  CarFuncTypes,
  [ CarFuncTypes ],
  any
>;
