import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { DangerZone } from 'redux-main/reducers/modules/geoobject/actions_by_type/danger_zone/@types';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { DispatchProp } from 'react-redux';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsDangerZoneFormWrap = {
  showForm: boolean;
  element: DangerZone | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page: string;
  path?: string;
};

export type StatePropsDangerZoneForm = {
  userData: InitialStateSession['userData'];
};
export type DispatchPropsDangerZoneForm = DispatchProp;
export type OwnPropsDangerZoneForm = {
  element: DangerZone | null;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsDangerZoneFormWithForm = (
  StatePropsDangerZoneForm
  & DispatchPropsDangerZoneForm
  & OwnPropsDangerZoneForm
);

export type PropsDangerZoneForm = OutputWithFormProps<
  PropsDangerZoneFormWithForm,
  DangerZone,
  [ DangerZone ],
  any
>;
export type StateDangerZoneForm = {
};
