import { TireModel } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';

export type PropsTireModelWithForm = WithFormRegistrySearchAddProps<TireModel>;

export type PropsTireModel = OutputWithFormProps<
  PropsTireModelWithForm,
  TireModel,
  [ TireModel ],
  any
>;
