import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { SnowStorage } from 'redux-main/reducers/modules/geoobject/actions_by_type/snow_storage/@types';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type PropsSnowStorageFormWithForm = WithFormRegistrySearchAddProps<SnowStorage>;

export type PropsSnowStorageForm = OutputWithFormProps<
  PropsSnowStorageFormWithForm,
  SnowStorage,
  [ SnowStorage ],
  any
>;
