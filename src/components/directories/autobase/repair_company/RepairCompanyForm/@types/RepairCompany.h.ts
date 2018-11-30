import { RepairCompany } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import {
  AutobaseCreateRepairCompany,
  AutobaseUpdateRepairCompany,
} from 'redux-main/reducers/modules/autobase/actions_by_type/repair_company/@types';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';

export type OnFormHideType = (isSubmited: boolean, result?: any) => void;

export type PropsRepairCompanyFormWrap = {
  showForm: boolean;
  element: RepairCompany | null;
  onFormHide: OnFormHideType

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsRepairCompany = {};
export type DispatchPropsRepairCompany = {
  createAction: AutobaseCreateRepairCompany;
  updateAction: AutobaseUpdateRepairCompany;
};
export type OwnRepairCompanyProps = {
  element: RepairCompany | null;
  handleHide: OnFormHideType
  page?: string;
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
