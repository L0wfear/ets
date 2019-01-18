import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { DangerZone, CreateDangerZone, UpdateDangerZone } from 'redux-main/reducers/modules/geoobject/actions_by_type/danger_zone/@types';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';

export type OnFormHideType = (isSubmited: boolean, result?: any) => void;

export type PropsDangerZoneFormWrap = {
  showForm: boolean;
  element: DangerZone | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
};

export type StatePropsDangerZoneForm = {
  userData: InitialStateSession['userData'];
};
export type DispatchPropsDangerZoneForm = {
  createAction: CreateDangerZone;
  updateAction: UpdateDangerZone;
};
export type OwnPropsDangerZoneForm = {
  element: DangerZone | null;
  handleHide: OnFormHideType
  page?: string;
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
