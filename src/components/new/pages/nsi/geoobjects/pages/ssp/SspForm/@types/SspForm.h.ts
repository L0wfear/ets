import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { Ssp, CreateSsp, UpdateSsp } from 'redux-main/reducers/modules/geoobject/actions_by_type/ssp/@types';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsSspFormWrap = {
  showForm: boolean;
  element: Ssp | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
};

export type StatePropsSspForm = {
  userData: InitialStateSession['userData'];
};
export type DispatchPropsSspForm = {
  createAction: CreateSsp;
  updateAction: UpdateSsp;
};
export type OwnPropsSspForm = {
  element: Ssp | null;
  handleHide: OnFormHideType
  page?: string;
  path?: string;
};

export type PropsSspFormWithForm = (
  StatePropsSspForm
  & DispatchPropsSspForm
  & OwnPropsSspForm
);

export type PropsSspForm = OutputWithFormProps<
  PropsSspFormWithForm,
  Ssp,
  [ Ssp ],
  any
>;
export type StateSspForm = {
};
