import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { Company } from 'redux-main/reducers/modules/company/@types/index';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';

export type PropsCompanyWithForm = WithFormRegistrySearchAddProps<Company>;

export type PropsCompany = OutputWithFormProps<
  PropsCompanyWithForm,
  Company,
  [ Company ],
  any
>;
