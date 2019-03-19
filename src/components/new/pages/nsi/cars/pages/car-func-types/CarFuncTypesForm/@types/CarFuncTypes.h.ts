import { CarFuncTypes } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { DispatchProp } from 'react-redux';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsCarFuncTypesFormWrap = {
  showForm: boolean;
  element: CarFuncTypes | null;
  onFormHide: OnFormHideType;

  loadingPageName?: string;
  registryKey?: string;
  path?: string;
};

export type StatePropsCarFuncTypes = {};
export type DispatchPropsCarFuncTypes = DispatchProp;
export type OwnCarFuncTypesProps = {
  element: CarFuncTypes | null;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsCarFuncTypesWithForm = (
  StatePropsCarFuncTypes
  & DispatchPropsCarFuncTypes
  & OwnCarFuncTypesProps
);

export type PropsCarFuncTypes = OutputWithFormProps<
  PropsCarFuncTypesWithForm,
  CarFuncTypes,
  [ CarFuncTypes ],
  any
>;
export type StateCarFuncTypes = {
};
