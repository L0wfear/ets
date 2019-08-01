import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { Carpool } from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/@types';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { DispatchProp } from 'react-redux';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsCarpoolFormWrap = {
  showForm: boolean;
  element: Carpool | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page: string;
  path?: string;
};

export type StatePropsCarpoolForm = {
  userData: InitialStateSession['userData'];
};
export type DispatchPropsCarpoolForm = DispatchProp;
export type OwnPropsCarpoolForm = {
  element: Carpool | null;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsCarpoolFormWithForm = (
  StatePropsCarpoolForm
  & DispatchPropsCarpoolForm
  & OwnPropsCarpoolForm
);

export type PropsCarpoolForm = OutputWithFormProps<
  PropsCarpoolFormWithForm,
  Carpool,
  [ Carpool ],
  any
>;
export type StateCarpoolForm = {
};
