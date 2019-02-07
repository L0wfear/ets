import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { Fountains, CreateFountains, UpdateFountains } from 'redux-main/reducers/modules/geoobject/actions_by_type/fountains/@types';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';

export type OnFormHideType = (isSubmited: boolean, result?: any) => void;

export type PropsFountainsFormWrap = {
  showForm: boolean;
  element: Fountains | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
};

export type StatePropsFountainsForm = {
  userData: InitialStateSession['userData'];
};
export type DispatchPropsFountainsForm = {
  createAction: CreateFountains;
  updateAction: UpdateFountains;
};
export type OwnPropsFountainsForm = {
  element: Fountains | null;
  handleHide: OnFormHideType
  page?: string;
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
