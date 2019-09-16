import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { Dt } from 'redux-main/reducers/modules/geoobject/actions_by_type/dt/@types';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type PropsDtFormWithForm = WithFormRegistrySearchAddProps<Dt>;

export type PropsDtForm = OutputWithFormProps<
  PropsDtFormWithForm,
  Dt,
  [ Dt ],
  any
>;
export type StateDtForm = {
};
