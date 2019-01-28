import { CompanyStructure, IStateCompanyStructure } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';

import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';

export type OnFormHideType = (isSubmited: boolean, result?: any) => void;

export type PropsCompanyStructureFormWrap = {
  showForm: boolean;
  element: CompanyStructure | null;
  onFormHide: OnFormHideType

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsCompanyStructure = {
  companyStructureLinearList: IStateCompanyStructure['companyStructureLinearList'];
  carpoolList: any;
};
export type DispatchPropsCompanyStructure = {
  createAction: any;
  updateAction: any;
};
export type OwnCompanyStructureProps = {
  element: CompanyStructure | null;
  handleHide: OnFormHideType
  page?: string;
  path?: string;
};

export type PropsCompanyStructureWithForm = (
  StatePropsCompanyStructure
  & DispatchPropsCompanyStructure
  & OwnCompanyStructureProps
);

export type PropsCompanyStructure = OutputWithFormProps<
  PropsCompanyStructureWithForm,
  CompanyStructure,
  [ CompanyStructure ],
  any
>;
export type StateCompanyStructure = {
};
