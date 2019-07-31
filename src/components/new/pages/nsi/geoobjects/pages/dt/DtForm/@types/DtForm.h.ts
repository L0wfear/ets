import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { Dt } from 'redux-main/reducers/modules/geoobject/actions_by_type/dt/@types';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsDtFormWrap = {
  showForm: boolean;
  element: Dt | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page: string;
  path?: string;
};

export type StatePropsDtForm = {
};
export type DispatchPropsDtForm = {
};
export type OwnPropsDtForm = {
  element: Partial<Dt>;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsDtFormWithForm = (
  StatePropsDtForm
  & DispatchPropsDtForm
  & OwnPropsDtForm
);

export type PropsDtForm = OutputWithFormProps<
  PropsDtFormWithForm,
  Dt,
  [ Dt ],
  any
>;
export type StateDtForm = {
};
