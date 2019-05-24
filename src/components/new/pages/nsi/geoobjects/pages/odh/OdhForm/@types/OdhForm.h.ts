import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { Odh } from 'redux-main/reducers/modules/geoobject/actions_by_type/odh/@types';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsOdhFormWrap = {
  showForm: boolean;
  element: Odh | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page: string;
  path?: string;
};

export type StatePropsOdhForm = {
};
export type DispatchPropsOdhForm = {
};
export type OwnPropsOdhForm = {
  element: Odh | null;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsOdhFormWithForm = (
  StatePropsOdhForm
  & DispatchPropsOdhForm
  & OwnPropsOdhForm
);

export type PropsOdhForm = OutputWithFormProps<
  PropsOdhFormWithForm,
  Odh,
  [ Odh ],
  any
>;
export type StateOdhForm = {
};
