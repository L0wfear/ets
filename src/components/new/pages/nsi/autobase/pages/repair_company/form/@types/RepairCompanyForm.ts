import { RepairCompany } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { DispatchProp } from 'react-redux';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsRepairCompanyFormLazy = {
  element: Partial<RepairCompany>;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
};

export type StatePropsRepairCompany = {};
export type DispatchPropsRepairCompany = DispatchProp;
export type OwnRepairCompanyProps = {
  element: Partial<RepairCompany>;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsRepairCompanyWithForm = (
  StatePropsRepairCompany
  & DispatchPropsRepairCompany
  & OwnRepairCompanyProps
);

export type PropsRepairCompany = OutputWithFormProps<
  PropsRepairCompanyWithForm,
  RepairCompany,
  [ RepairCompany ],
  any
>;
export type StateRepairCompany = {
};
