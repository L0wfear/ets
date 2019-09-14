import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { Msp } from 'redux-main/reducers/modules/geoobject/actions_by_type/msp/@types';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';

export type PropsMspFormWithForm = WithFormRegistrySearchAddProps<Msp>;

export type PropsMspForm = OutputWithFormProps<
  PropsMspFormWithForm,
  Msp,
  [ Msp ],
  any
>;
