import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { DispatchProp } from 'react-redux';
import { Company } from 'redux-main/reducers/modules/company/@types/index';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsCompanyFormWrap = {
  showForm: boolean;
  element: Company | null;
  onFormHide: OnFormHideType

  loadingPageName?: string;
  registryKey?: string;
  path?: string;
};

export type StatePropsCompany = {};
export type DispatchPropsCompany = DispatchProp;
export type OwnCompanyProps = {
  element: Company | null;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsCompanyWithForm = (
  StatePropsCompany
  & DispatchPropsCompany
  & OwnCompanyProps
);

export type PropsCompany = OutputWithFormProps<
  PropsCompanyWithForm,
  Company,
  [ Company ],
  any
>;
export type StateCompany = {
};
