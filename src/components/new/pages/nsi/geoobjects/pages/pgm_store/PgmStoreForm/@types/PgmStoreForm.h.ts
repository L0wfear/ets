import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { PgmStore } from 'redux-main/reducers/modules/geoobject/actions_by_type/pgm_store/@types';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';

export type PropsPgmStoreFormWithForm = WithFormRegistrySearchAddProps<PgmStore>;

export type PropsPgmStoreForm = OutputWithFormProps<
  PropsPgmStoreFormWithForm,
  PgmStore,
  [ PgmStore ],
  any
>;
