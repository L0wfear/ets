import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { Msp } from 'redux-main/reducers/modules/geoobject/actions_by_type/msp/@types';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsMspFormWrap = {
  showForm: boolean;
  element: Msp | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page: string;
  path?: string;
};

export type StatePropsMspForm = {
  userData: InitialStateSession['userData'];
};
export type OwnPropsMspForm = {
  element: Msp | null;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsMspFormWithForm = (
  StatePropsMspForm
  & OwnPropsMspForm
);

export type PropsMspForm = OutputWithFormProps<
  PropsMspFormWithForm,
  Msp,
  [ Msp ],
  any
>;
export type StateMspForm = {
};
