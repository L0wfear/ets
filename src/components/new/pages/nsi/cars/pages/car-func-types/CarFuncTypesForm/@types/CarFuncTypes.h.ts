import { CarFuncTypes } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import {
  AutobaseCreateCarFuncTypes,
  AutobaseUpdateCarFuncTypes,
} from 'redux-main/reducers/modules/autobase/car_func_types/@types';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsCarFuncTypesFormWrap = {
  showForm: boolean;
  element: CarFuncTypes | null;
  onFormHide: OnFormHideType

  loadingPageName?: string;
  registryKey?: string;
  path?: string;
};

export type StatePropsCarFuncTypes = {};
export type DispatchPropsCarFuncTypes = {
  createAction: AutobaseCreateCarFuncTypes;
  updateAction: AutobaseUpdateCarFuncTypes;
};
export type OwnCarFuncTypesProps = {
  element: CarFuncTypes | null;
  handleHide: OnFormHideType
  page?: string;
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
