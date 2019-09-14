import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { Odh } from 'redux-main/reducers/modules/geoobject/actions_by_type/odh/@types';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type PropsOdhFormWithForm = WithFormRegistrySearchAddProps<Odh>;

export type PropsOdhForm = OutputWithFormProps<
  PropsOdhFormWithForm,
  Odh,
  [ Odh ],
  any
>;
export type StateOdhForm = {
};
