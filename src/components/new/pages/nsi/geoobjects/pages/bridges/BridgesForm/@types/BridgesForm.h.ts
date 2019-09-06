import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { Bridges } from 'redux-main/reducers/modules/geoobject/actions_by_type/bridges/@types';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsBridgesFormWrap = {
  showForm: boolean;
  element: Bridges | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page: string;
  path?: string;
};

export type StatePropsBridgesForm = {
  userData: InitialStateSession['userData'];
};
export type OwnPropsBridgesForm = {
  element: Bridges | null;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsBridgesFormWithForm = (
  StatePropsBridgesForm
  & OwnPropsBridgesForm
);

export type PropsBridgesForm = OutputWithFormProps<
  PropsBridgesFormWithForm,
  Bridges,
  [ Bridges ],
  any
>;
export type StateBridgesForm = {
};
