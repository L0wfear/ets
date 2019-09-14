import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { Bridges } from 'redux-main/reducers/modules/geoobject/actions_by_type/bridges/@types';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';

export type PropsBridgesFormWithForm = WithFormRegistrySearchAddProps<Bridges>;

export type PropsBridgesForm = OutputWithFormProps<
  PropsBridgesFormWithForm,
  Bridges,
  [ Bridges ],
  any
>;
export type StateBridgesForm = {
};
