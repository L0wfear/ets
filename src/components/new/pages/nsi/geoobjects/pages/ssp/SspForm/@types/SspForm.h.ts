import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { Ssp } from 'redux-main/reducers/modules/geoobject/actions_by_type/ssp/@types';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type OwnPropsSspForm = WithFormRegistrySearchAddProps<Ssp>;

export type PropsSspFormWithForm = (
  OwnPropsSspForm
);

export type PropsSspForm = OutputWithFormProps<
  PropsSspFormWithForm,
  Ssp
>;
