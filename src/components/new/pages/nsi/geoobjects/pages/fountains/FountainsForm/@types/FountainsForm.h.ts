import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { Fountains } from 'redux-main/reducers/modules/geoobject/actions_by_type/fountains/@types';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type PropsFountainsFormWithForm = WithFormRegistrySearchAddProps<Fountains>;

export type PropsFountainsForm = OutputWithFormProps<
  PropsFountainsFormWithForm,
  Fountains,
  [ Fountains ],
  any
>;
