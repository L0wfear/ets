import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { Carpool } from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/@types';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';

export type PropsCarpoolFormWithForm = WithFormRegistrySearchAddProps<Carpool>;

export type PropsCarpoolForm = OutputWithFormProps<
  PropsCarpoolFormWithForm,
  Carpool,
  [ Carpool ],
  any
>;
