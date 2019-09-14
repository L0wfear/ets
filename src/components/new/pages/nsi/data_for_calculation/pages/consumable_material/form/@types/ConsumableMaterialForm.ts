import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { ConsumableMaterial } from 'redux-main/reducers/modules/consumable_material/@types/consumableMaterial';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';

export type PropsConsumableMaterialWithForm = WithFormRegistrySearchAddProps<ConsumableMaterial>;

export type PropsConsumableMaterial = OutputWithFormProps<
  PropsConsumableMaterialWithForm,
  ConsumableMaterial,
  [ ConsumableMaterial ],
  any
>;
