import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { DispatchProp } from 'react-redux';
import { Contractor } from 'redux-main/reducers/modules/repair/contractor/@types/contractor';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsContractorFormLazy = {
  element: Partial<Contractor>;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
};

export type StatePropsContractor = {};
export type DispatchPropsContractor = DispatchProp;
export type OwnContractorProps = {
  element: Partial<Contractor>;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsContractorWithForm = (
  StatePropsContractor
  & DispatchPropsContractor
  & OwnContractorProps
);

export type PropsContractor = OutputWithFormProps<
  PropsContractorWithForm,
  Contractor,
  [ Contractor ],
  any
>;
