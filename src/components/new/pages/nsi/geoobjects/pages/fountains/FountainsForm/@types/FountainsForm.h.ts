import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { Fountains } from 'redux-main/reducers/modules/geoobject/actions_by_type/fountains/@types';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { DispatchProp } from 'react-redux';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsFountainsFormWrap = {
  showForm: boolean;
  element: Fountains | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page: string;
  path?: string;
};

export type StatePropsFountainsForm = {
  userData: InitialStateSession['userData'];
};
export type DispatchPropsFountainsForm = DispatchProp;
export type OwnPropsFountainsForm = {
  element: Fountains | null;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsFountainsFormWithForm = (
  StatePropsFountainsForm
  & DispatchPropsFountainsForm
  & OwnPropsFountainsForm
);

export type PropsFountainsForm = OutputWithFormProps<
  PropsFountainsFormWithForm,
  Fountains,
  [ Fountains ],
  any
>;
export type StateFountainsForm = {
};
