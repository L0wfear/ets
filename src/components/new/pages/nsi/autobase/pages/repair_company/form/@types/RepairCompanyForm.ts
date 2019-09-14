import { RepairCompany } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';

export type PropsRepairCompanyWithForm = WithFormRegistrySearchAddProps<RepairCompany>;

export type PropsRepairCompany = OutputWithFormProps<
  PropsRepairCompanyWithForm,
  RepairCompany,
  [ RepairCompany ],
  any
>;
